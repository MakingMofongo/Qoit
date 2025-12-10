import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Slack OAuth scopes needed to update user status
const SLACK_SCOPES = [
  "users.profile:write", // Set custom status (emoji + text)
  "users.profile:read",  // Read current status
  "users:read",          // Get user info
  "users:write",         // Set presence (Active/Away)
].join(",");

export async function GET() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  }

  const clientId = process.env.SLACK_CLIENT_ID;
  
  if (!clientId) {
    return NextResponse.json(
      { error: "Slack integration not configured" },
      { status: 500 }
    );
  }

  // Generate state parameter for security (includes user ID)
  const state = Buffer.from(JSON.stringify({
    userId: user.id,
    timestamp: Date.now(),
  })).toString("base64");

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/integrations/slack/callback`;

  // Slack OAuth URL
  const slackAuthUrl = new URL("https://slack.com/oauth/v2/authorize");
  slackAuthUrl.searchParams.set("client_id", clientId);
  slackAuthUrl.searchParams.set("user_scope", SLACK_SCOPES);
  slackAuthUrl.searchParams.set("redirect_uri", redirectUri);
  slackAuthUrl.searchParams.set("state", state);

  return NextResponse.redirect(slackAuthUrl.toString());
}

