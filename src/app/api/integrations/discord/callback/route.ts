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
    console.error("Discord OAuth error:", error);
    return NextResponse.redirect(`${dashboardUrl}?error=discord_auth_failed`);
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
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = `${appUrl}/api/integrations/discord/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${dashboardUrl}?error=discord_not_configured`);
  }

  try {
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("Discord token exchange failed:", tokenData.error);
      return NextResponse.redirect(`${dashboardUrl}?error=discord_token_failed`);
    }

    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const expiresIn = tokenData.expires_in;
    const scope = tokenData.scope;
    const webhook = tokenData.webhook; // Contains webhook URL if authorized

    if (!accessToken) {
      console.error("No access token in response:", tokenData);
      return NextResponse.redirect(`${dashboardUrl}?error=no_access_token`);
    }

    // Get user info
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const discordUser = await userResponse.json();

    // Calculate expiration time
    const expiresAt = expiresIn 
      ? new Date(Date.now() + expiresIn * 1000).toISOString()
      : null;

    // Store the integration - include webhook URL if available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: dbError } = await (supabase.from("integrations") as any).upsert(
      {
        user_id: user.id,
        type: "discord",
        access_token: webhook?.url || accessToken, // Store webhook URL as access_token for simplicity
        refresh_token: refreshToken,
        team_id: discordUser.id,
        team_name: `${discordUser.username}${webhook ? ` → #${webhook.channel_id}` : ""}`,
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
      console.error("Failed to store Discord integration:", dbError);
      return NextResponse.redirect(`${dashboardUrl}?error=db_error`);
    }

    console.log(`Discord connected for user ${user.id}, Discord user ${discordUser.username}`);

    return NextResponse.redirect(`${dashboardUrl}?success=discord_connected`);

  } catch (err) {
    console.error("Discord OAuth exchange error:", err);
    return NextResponse.redirect(`${dashboardUrl}?error=discord_exchange_failed`);
  }
}

