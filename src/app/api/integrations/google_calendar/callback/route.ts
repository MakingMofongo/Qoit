import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const dashboardUrl = `${appUrl}/dashboard`;

  // Handle user cancellation or errors
  if (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(`${dashboardUrl}?error=google_auth_failed`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${dashboardUrl}?error=invalid_oauth_response`);
  }

  // Decode and validate state
  let stateData: { userId: string; timestamp: number };
  try {
    stateData = JSON.parse(Buffer.from(state, "base64").toString());
    
    // Check state is not too old (10 minutes max)
    if (Date.now() - stateData.timestamp > 10 * 60 * 1000) {
      return NextResponse.redirect(`${dashboardUrl}?error=oauth_expired`);
    }
  } catch {
    return NextResponse.redirect(`${dashboardUrl}?error=invalid_state`);
  }

  // Verify user is still authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== stateData.userId) {
    return NextResponse.redirect(`${appUrl}/login`);
  }

  // Exchange code for access token
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${appUrl}/api/integrations/google_calendar/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${dashboardUrl}?error=google_not_configured`);
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("Google token exchange failed:", tokenData.error);
      return NextResponse.redirect(`${dashboardUrl}?error=google_token_failed`);
    }

    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const expiresIn = tokenData.expires_in; // seconds until expiration
    const scope = tokenData.scope;

    if (!accessToken) {
      console.error("No access token in response:", tokenData);
      return NextResponse.redirect(`${dashboardUrl}?error=no_access_token`);
    }

    // Calculate expiration time
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    // Get user's email to identify the calendar
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userInfo = await userInfoResponse.json();

    // Store or update the integration in the database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: dbError } = await (supabase.from("integrations") as any).upsert(
      {
        user_id: user.id,
        type: "google_calendar",
        access_token: accessToken,
        refresh_token: refreshToken,
        team_name: userInfo.email, // Use email as identifier
        scope: scope,
        expires_at: expiresAt,
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,type",
      }
    );

    if (dbError) {
      console.error("Failed to store Google Calendar integration:", dbError);
      return NextResponse.redirect(`${dashboardUrl}?error=db_error`);
    }

    console.log(`Google Calendar connected for user ${user.id}, email ${userInfo.email}`);

    // Redirect back to dashboard with success
    return NextResponse.redirect(`${dashboardUrl}?success=google_calendar_connected`);

  } catch (err) {
    console.error("Google OAuth exchange error:", err);
    return NextResponse.redirect(`${dashboardUrl}?error=google_exchange_failed`);
  }
}

