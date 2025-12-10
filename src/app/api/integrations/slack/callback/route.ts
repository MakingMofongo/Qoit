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
    console.error("Slack OAuth error:", error);
    return NextResponse.redirect(`${dashboardUrl}?error=slack_auth_failed`);
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
  const clientId = process.env.SLACK_CLIENT_ID;
  const clientSecret = process.env.SLACK_CLIENT_SECRET;
  const redirectUri = `${appUrl}/api/integrations/slack/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${dashboardUrl}?error=slack_not_configured`);
  }

  try {
    const tokenResponse = await fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.ok) {
      console.error("Slack token exchange failed:", tokenData.error);
      return NextResponse.redirect(`${dashboardUrl}?error=slack_token_failed`);
    }

    // Extract user token (we're using user_scope, so token is in authed_user)
    const accessToken = tokenData.authed_user?.access_token;
    const slackUserId = tokenData.authed_user?.id;
    const teamId = tokenData.team?.id;
    const teamName = tokenData.team?.name;
    const scope = tokenData.authed_user?.scope;

    if (!accessToken) {
      console.error("No access token in response:", tokenData);
      return NextResponse.redirect(`${dashboardUrl}?error=no_access_token`);
    }

    // Store or update the integration in the database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: dbError } = await (supabase.from("integrations") as any).upsert(
      {
        user_id: user.id,
        type: "slack",
        access_token: accessToken,
        team_id: teamId,
        team_name: teamName,
        scope: scope,
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,type",
      }
    );

    if (dbError) {
      console.error("Failed to store Slack integration:", dbError);
      return NextResponse.redirect(`${dashboardUrl}?error=db_error`);
    }

    console.log(`Slack connected for user ${user.id}, Slack user ${slackUserId}`);

    // Redirect back to dashboard with success
    return NextResponse.redirect(`${dashboardUrl}?success=slack_connected`);

  } catch (err) {
    console.error("Slack OAuth exchange error:", err);
    return NextResponse.redirect(`${dashboardUrl}?error=slack_exchange_failed`);
  }
}

