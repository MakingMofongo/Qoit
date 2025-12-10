import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// Status configurations
const STATUS_CONFIG = {
  available: {
    emoji: "✓",
    label: "Available",
    color: "#22c55e",
    bgGradient: ["#1a2e1a", "#0f1f0f"],
  },
  qoit: {
    emoji: "🌙",
    label: "Qoit Mode",
    color: "#4a5d4a",
    bgGradient: ["#1a1f1a", "#0f140f"],
  },
  focused: {
    emoji: "⚡",
    label: "Deep Work",
    color: "#c9a962",
    bgGradient: ["#2a2515", "#1a1810"],
  },
  away: {
    emoji: "✈️",
    label: "Away",
    color: "#a85d5d",
    bgGradient: ["#2a1a1a", "#1a0f0f"],
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = (searchParams.get("status") || "qoit") as keyof typeof STATUS_CONFIG;
  const message = searchParams.get("message") || "";
  const backAt = searchParams.get("backAt") || "";
  const username = searchParams.get("username") || "Someone";

  const config = STATUS_CONFIG[status] || STATUS_CONFIG.qoit;

  // Format back time
  let backAtText = "";
  if (backAt) {
    try {
      const backDate = new Date(backAt);
      backAtText = `Back at ${backDate.toLocaleTimeString("en-US", { 
        hour: "numeric", 
        minute: "2-digit",
        hour12: true 
      })}`;
    } catch {
      backAtText = "";
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: `linear-gradient(135deg, ${config.bgGradient[0]}, ${config.bgGradient[1]})`,
          fontFamily: "system-ui, sans-serif",
          padding: "40px",
        }}
      >
        {/* Status indicator ring */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "120px",
            height: "120px",
            borderRadius: "60px",
            background: `linear-gradient(135deg, ${config.color}40, ${config.color}20)`,
            border: `4px solid ${config.color}`,
            marginBottom: "24px",
          }}
        >
          <span style={{ fontSize: "56px" }}>{config.emoji}</span>
        </div>

        {/* Status label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "6px",
              background: config.color,
              boxShadow: `0 0 12px ${config.color}`,
            }}
          />
          <span
            style={{
              fontSize: "32px",
              fontWeight: 600,
              color: "#faf9f7",
              letterSpacing: "-0.02em",
            }}
          >
            {config.label}
          </span>
        </div>

        {/* Username */}
        <span
          style={{
            fontSize: "20px",
            color: "#8a8780",
            marginBottom: "8px",
          }}
        >
          {username}
        </span>

        {/* Message */}
        {message && (
          <span
            style={{
              fontSize: "18px",
              color: "#c9c8c4",
              marginTop: "16px",
              textAlign: "center",
              maxWidth: "400px",
              fontStyle: "italic",
            }}
          >
            "{message}"
          </span>
        )}

        {/* Back at time */}
        {backAtText && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "24px",
              padding: "12px 24px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span style={{ fontSize: "16px", color: "#8a8780" }}>⏰</span>
            <span style={{ fontSize: "16px", color: "#c9c8c4" }}>{backAtText}</span>
          </div>
        )}

        {/* Qoit branding */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            right: "32px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            opacity: 0.5,
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "10px",
              background: "#faf9f7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "4px",
                background: "#1a1915",
              }}
            />
          </div>
          <span style={{ fontSize: "14px", color: "#8a8780", fontWeight: 500 }}>
            qoit
          </span>
        </div>
      </div>
    ),
    {
      width: 480,
      height: 320,
    }
  );
}

