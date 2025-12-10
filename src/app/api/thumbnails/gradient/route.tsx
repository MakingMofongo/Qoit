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
          background: "linear-gradient(135deg, #4a5d4a 0%, #c9a962 100%)",
          gap: 102,
        }}
      >
        <div
          style={{
            width: 448,
            height: 448,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 80px 160px -38px rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              width: 144,
              height: 144,
              borderRadius: "50%",
              background: "#1a1915",
            }}
          />
        </div>
        <span
          style={{
            fontSize: 179,
            fontWeight: 500,
            color: "white",
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

