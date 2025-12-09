import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Quiet — The most beautiful way to go offline";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#faf9f7",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(201, 169, 98, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -100,
            width: 350,
            height: 350,
            background: "radial-gradient(circle, rgba(74, 93, 74, 0.12) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#1a1915",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#faf9f7",
              }}
            />
          </div>
          <span
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: "#1a1915",
              letterSpacing: "-0.02em",
            }}
          >
            quiet
          </span>
        </div>

        {/* Main text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: 600,
              color: "#1a1915",
              margin: 0,
              letterSpacing: "-0.03em",
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            The most beautiful
          </h1>
          <h1
            style={{
              fontSize: 72,
              fontWeight: 600,
              color: "#1a1915",
              margin: 0,
              letterSpacing: "-0.03em",
              textAlign: "center",
              lineHeight: 1.1,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            way to go{" "}
            <span
              style={{
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  bottom: 8,
                  left: 0,
                  right: 0,
                  height: 12,
                  background: "rgba(201, 169, 98, 0.4)",
                  borderRadius: 6,
                }}
              />
              <span style={{ position: "relative" }}>offline</span>
            </span>
          </h1>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: 28,
            color: "#8a8780",
            marginTop: 32,
            letterSpacing: "-0.01em",
          }}
        >
          Not "out of office." Just... quiet.
        </p>

        {/* Sound wave visualization - fading out */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 4,
            marginTop: 48,
            height: 32,
          }}
        >
          {[0.3, 0.5, 0.8, 1, 0.7, 0.4, 0.6, 0.9, 0.5, 0.3, 0.2, 0.15, 0.1, 0.08, 0.05, 0.05].map(
            (scale, i) => (
              <div
                key={i}
                style={{
                  width: 4,
                  height: 32 * scale,
                  background: "#8a8780",
                  borderRadius: 2,
                }}
              />
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
