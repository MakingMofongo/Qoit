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
          gap: 128,
        }}
      >
        <div
          style={{
            width: 640,
            height: 640,
            borderRadius: "50%",
            background: "#1a1915",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 208,
              height: 208,
              borderRadius: "50%",
              background: "#faf9f7",
            }}
          />
        </div>
        <span
          style={{
            fontSize: 230,
            fontWeight: 600,
            color: "#1a1915",
            letterSpacing: "-0.02em",
          }}
        >
          qoit
        </span>
      </div>
    ),
    { width: 3840, height: 2160 }
  );
}

