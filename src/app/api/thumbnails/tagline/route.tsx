import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#faf9f7",
          gap: 77,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 64,
          }}
        >
          <div
            style={{
              width: 256,
              height: 256,
              borderRadius: "50%",
              background: "#1a1915",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 83,
                height: 83,
                borderRadius: "50%",
                background: "#faf9f7",
              }}
            />
          </div>
          <span
            style={{
              fontSize: 179,
              fontWeight: 600,
              color: "#1a1915",
              letterSpacing: "-0.02em",
            }}
          >
            qoit
          </span>
        </div>
        <span
          style={{
            fontSize: 90,
            color: "#8a8780",
            letterSpacing: "-0.01em",
          }}
        >
          The beautiful way to go offline
        </span>
      </div>
    ),
    { width: 3840, height: 2160 }
  );
}

