import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Google Calendar OAuth scopes
const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly", // Read calendar events
  "https://www.googleapis.com/auth/calendar.events",   // Create/modify events
].join(" ");

export async function GET() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    return NextResponse.json(
      { error: "Google Calendar integration not configured" },
      { status: 500 }
    );
  }

  // Generate state parameter for security (includes user ID)
  const state = Buffer.from(JSON.stringify({
    userId: user.id,
    timestamp: Date.now(),
  })).toString("base64");

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/integrations/google_calendar/callback`;

  // Google OAuth URL
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", GOOGLE_SCOPES);
  googleAuthUrl.searchParams.set("state", state);
  googleAuthUrl.searchParams.set("access_type", "offline"); // Get refresh token
  googleAuthUrl.searchParams.set("prompt", "consent"); // Force consent to get refresh token

  return NextResponse.redirect(googleAuthUrl.toString());
}

