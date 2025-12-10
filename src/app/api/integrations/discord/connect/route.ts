import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Discord OAuth scopes
const DISCORD_SCOPES = [
  "identify",        // Get user info
  "webhook.incoming" // Create incoming webhook
].join(" ");

export async function GET() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  
  if (!clientId) {
    return NextResponse.json(
      { error: "Discord integration not configured" },
      { status: 500 }
    );
  }

  // Generate state parameter for security (includes user ID)
  const state = Buffer.from(JSON.stringify({
    userId: user.id,
    timestamp: Date.now(),
  })).toString("base64");

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/integrations/discord/callback`;

  // Discord OAuth URL
  const discordAuthUrl = new URL("https://discord.com/api/oauth2/authorize");
  discordAuthUrl.searchParams.set("client_id", clientId);
  discordAuthUrl.searchParams.set("redirect_uri", redirectUri);
  discordAuthUrl.searchParams.set("response_type", "code");
  discordAuthUrl.searchParams.set("scope", DISCORD_SCOPES);
  discordAuthUrl.searchParams.set("state", state);

  return NextResponse.redirect(discordAuthUrl.toString());
}

