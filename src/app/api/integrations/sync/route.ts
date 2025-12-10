import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { StatusMode, Integration } from "@/types/database";

// Map Qoit status modes to Slack status
const STATUS_TO_SLACK: Record<StatusMode, { emoji: string; text: string }> = {
  available: {
    emoji: "",
    text: "",
  },
  qoit: {
    emoji: ":crescent_moon:",
    text: "Qoit mode - going quiet",
  },
  focused: {
    emoji: ":zap:",
    text: "Deep work - limited availability",
  },
  away: {
    emoji: ":airplane:",
    text: "Away",
  },
};

// Map Qoit status modes to calendar event titles
const STATUS_TO_CALENDAR: Record<StatusMode, { title: string; color: string }> = {
  available: { title: "", color: "2" }, // green
  qoit: { title: "🌙 Qoit Mode", color: "8" }, // gray
  focused: { title: "⚡ Deep Work", color: "5" }, // yellow
  away: { title: "✈️ Away", color: "11" }, // red
};

// Map Qoit status modes to Discord embed colors and emojis
const STATUS_TO_DISCORD: Record<StatusMode, { emoji: string; title: string; color: number }> = {
  available: { emoji: "✅", title: "Back & Available", color: 0x22c55e }, // green
  qoit: { emoji: "🌙", title: "Qoit Mode", color: 0x4a5d4a }, // muted green
  focused: { emoji: "⚡", title: "Deep Work", color: 0xc9a962 }, // gold
  away: { emoji: "✈️", title: "Away", color: 0xa85d5d }, // muted red
};

async function syncToSlack(
  integration: Integration,
  status: StatusMode,
  statusMessage: string | null,
  backAt: string | null
): Promise<{ success: boolean; error?: string }> {
  const slackStatus = STATUS_TO_SLACK[status];
  
  // Build status text
  let statusText = slackStatus.text;
  if (statusMessage) {
    statusText = statusMessage;
  }
  if (backAt && status !== "available") {
    const backDate = new Date(backAt);
    const now = new Date();
    if (backDate > now) {
      statusText += ` • Back ${backDate.toLocaleDateString()}`;
    }
  }

  // Calculate expiration (0 means no expiration, or we can set it to back_at time)
  let expiration = 0;
  if (backAt && status !== "available") {
    expiration = Math.floor(new Date(backAt).getTime() / 1000);
  }

  try {
    // Set custom status (emoji + text)
    const profileResponse = await fetch("https://slack.com/api/users.profile.set", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${integration.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profile: {
          status_text: statusText.substring(0, 100), // Slack limit
          status_emoji: slackStatus.emoji,
          status_expiration: expiration,
        },
      }),
    });

    const profileData = await profileResponse.json();

    if (!profileData.ok) {
      console.error("Slack profile status update failed:", profileData.error);
      return { success: false, error: profileData.error };
    }

    // Set presence (Active/Away)
    // "away" for non-available statuses, "auto" to return to normal
    const presence = status === "available" ? "auto" : "away";
    
    const presenceResponse = await fetch("https://slack.com/api/users.setPresence", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${integration.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ presence }),
    });

    const presenceData = await presenceResponse.json();

    if (!presenceData.ok) {
      // Presence update is optional, don't fail the whole sync
      console.warn("Slack presence update failed:", presenceData.error);
    }

    return { success: true };
  } catch (err) {
    console.error("Slack API error:", err);
    return { success: false, error: "Network error" };
  }
}

async function refreshGoogleToken(integration: Integration): Promise<string | null> {
  if (!integration.refresh_token) return null;
  
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) return null;
  
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: integration.refresh_token,
        grant_type: "refresh_token",
      }),
    });
    
    const data = await response.json();
    return data.access_token || null;
  } catch {
    return null;
  }
}

async function deleteExistingQoitEvent(accessToken: string): Promise<void> {
  try {
    // Search for existing Qoit events (created in the last 24 hours, not ended yet)
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const searchParams = new URLSearchParams({
      timeMin: yesterday.toISOString(),
      timeMax: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Next 30 days
      q: "Qoit", // Search for events with "Qoit" in description
      singleEvents: "true",
    });
    
    const listResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${searchParams}`,
      {
        headers: { "Authorization": `Bearer ${accessToken}` },
      }
    );
    
    const listData = await listResponse.json();
    
    if (listData.items) {
      // Delete any existing Qoit events that haven't ended yet
      for (const event of listData.items) {
        if (event.description?.includes("synced from Qoit")) {
          const eventEnd = new Date(event.end?.dateTime || event.end?.date);
          if (eventEnd > now) {
            // Delete this event
            await fetch(
              `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.id}`,
              {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${accessToken}` },
              }
            );
            console.log(`Deleted Qoit calendar event: ${event.id}`);
          }
        }
      }
    }
  } catch (err) {
    console.warn("Failed to clean up old Qoit events:", err);
  }
}

async function syncToGoogleCalendar(
  integration: Integration,
  status: StatusMode,
  statusMessage: string | null,
  backAt: string | null
): Promise<{ success: boolean; error?: string }> {
  // Check if token is expired and refresh if needed
  let accessToken = integration.access_token;
  if (integration.expires_at && new Date(integration.expires_at) < new Date()) {
    const newToken = await refreshGoogleToken(integration);
    if (!newToken) {
      return { success: false, error: "Token expired and refresh failed" };
    }
    accessToken = newToken;
  }

  // Always delete existing Qoit events first
  await deleteExistingQoitEvent(accessToken);

  // If going available, just delete (already done above)
  if (status === "available") {
    return { success: true };
  }

  const calendarConfig = STATUS_TO_CALENDAR[status];
  
  // Create a calendar event for the focus/away time
  const now = new Date();
  const endTime = backAt ? new Date(backAt) : new Date(now.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours
  
  const event = {
    summary: statusMessage ? `${calendarConfig.title}: ${statusMessage}` : calendarConfig.title,
    description: `Status synced from Qoit - ${statusMessage || status}`,
    start: {
      dateTime: now.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    colorId: calendarConfig.color,
    transparency: "opaque", // Show as busy
    reminders: {
      useDefault: false,
      overrides: [], // No reminders
    },
  };

  try {
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("Google Calendar event creation failed:", data.error);
      return { success: false, error: data.error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Google Calendar API error:", err);
    return { success: false, error: "Network error" };
  }
}

async function syncToDiscord(
  integration: Integration,
  status: StatusMode,
  statusMessage: string | null,
  backAt: string | null,
  username?: string
): Promise<{ success: boolean; error?: string }> {
  // The access_token field stores the webhook URL for Discord
  const webhookUrl = integration.access_token;
  
  if (!webhookUrl || !webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
    return { success: false, error: "No valid webhook URL" };
  }

  const discordStatus = STATUS_TO_DISCORD[status];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  // Build the status image URL
  const imageParams = new URLSearchParams({
    status,
    ...(statusMessage && { message: statusMessage }),
    ...(backAt && { backAt }),
    ...(username && { username }),
  });
  const imageUrl = `${appUrl}/api/integrations/discord/status-image?${imageParams.toString()}`;
  
  // Format back time
  let backAtText = "";
  if (backAt && status !== "available") {
    const backDate = new Date(backAt);
    backAtText = backDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  }

  // Build rich embed fields
  const fields = [];
  
  if (username) {
    fields.push({ name: "👤 Who", value: username, inline: true });
  }
  
  if (backAtText) {
    fields.push({ name: "⏰ Back at", value: backAtText, inline: true });
  }
  
  if (statusMessage) {
    fields.push({ name: "💬 Message", value: statusMessage, inline: false });
  }

  // Check if we're in production (can serve images)
  const isProduction = appUrl.includes("qoit.page") || appUrl.includes("vercel");
  
  // Discord webhook embed
  const embed = {
    title: `${discordStatus.emoji} ${discordStatus.title}`,
    color: discordStatus.color,
    ...(fields.length > 0 && { fields }),
    ...(isProduction && { image: { url: imageUrl } }),
    timestamp: new Date().toISOString(),
    footer: { text: "qoit.page" },
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Qoit",
        avatar_url: `${appUrl}/favicon.ico`,
        embeds: [embed],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Discord webhook failed:", errorText);
      return { success: false, error: `Webhook failed: ${response.status}` };
    }

    return { success: true };
  } catch (err) {
    console.error("Discord webhook error:", err);
    return { success: false, error: "Network error" };
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the sync request body
  const body = await request.json();
  const { status, statusMessage, backAt } = body as {
    status: StatusMode;
    statusMessage: string | null;
    backAt: string | null;
  };

  if (!status) {
    return NextResponse.json({ error: "Status is required" }, { status: 400 });
  }

  // Get user profile for display name
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase.from("profiles") as any)
    .select("display_name")
    .eq("id", user.id)
    .single();
  
  const displayName = profile?.display_name || user.email?.split("@")[0] || "Someone";

  // Get all active integrations for this user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: integrations, error } = await (supabase.from("integrations") as any)
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (error) {
    console.error("Failed to fetch integrations:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  const results: Record<string, { success: boolean; error?: string }> = {};

  // Sync to each connected integration
  for (const integration of (integrations || []) as Integration[]) {
    switch (integration.type) {
      case "slack":
        results.slack = await syncToSlack(integration, status, statusMessage, backAt);
        break;
      
      case "google_calendar":
        results.google_calendar = await syncToGoogleCalendar(integration, status, statusMessage, backAt);
        break;
      
      case "discord":
        results.discord = await syncToDiscord(integration, status, statusMessage, backAt, displayName);
        break;
    }
  }

  return NextResponse.json({
    success: true,
    synced: results,
    integrationCount: integrations?.length || 0,
  });
}

