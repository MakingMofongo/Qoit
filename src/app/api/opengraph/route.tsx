import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";

const size = { width: 3840, height: 2160 };

export async function GET() {
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
            top: -320,
            right: -320,
            width: 1280,
            height: 1280,
            background: "radial-gradient(circle, rgba(201, 169, 98, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -320,
            left: -320,
            width: 1120,
            height: 1120,
            background: "radial-gradient(circle, rgba(74, 93, 74, 0.12) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 51,
            marginBottom: 154,
          }}
        >
          <div
            style={{
              width: 179,
              height: 179,
              borderRadius: "50%",
              background: "#1a1915",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: "50%",
                background: "#faf9f7",
              }}
            />
          </div>
          <span
            style={{
              fontSize: 115,
              fontWeight: 600,
              color: "#1a1915",
              letterSpacing: "-0.02em",
            }}
          >
            qoit
          </span>
        </div>

        {/* Main text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 51,
          }}
        >
          <h1
            style={{
              fontSize: 230,
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
              fontSize: 230,
              fontWeight: 600,
              color: "#1a1915",
              margin: 0,
              letterSpacing: "-0.03em",
              textAlign: "center",
              lineHeight: 1.1,
              display: "flex",
              alignItems: "center",
              gap: 51,
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
                  bottom: 26,
                  left: 0,
                  right: 0,
                  height: 38,
                  background: "rgba(201, 169, 98, 0.4)",
                  borderRadius: 19,
                }}
              />
              <span style={{ position: "relative" }}>offline</span>
            </span>
          </h1>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: 90,
            color: "#8a8780",
            marginTop: 102,
            letterSpacing: "-0.01em",
          }}
        >
          Not "out of office." Just... qoit.
        </p>

        {/* Sound wave visualization */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 13,
            marginTop: 154,
            height: 102,
          }}
        >
          {[0.3, 0.5, 0.8, 1, 0.7, 0.4, 0.6, 0.9, 0.5, 0.3, 0.2, 0.15, 0.1, 0.08, 0.05, 0.05].map(
            (scale, i) => (
              <div
                key={i}
                style={{
                  width: 13,
                  height: 102 * scale,
                  background: "#8a8780",
                  borderRadius: 6,
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

