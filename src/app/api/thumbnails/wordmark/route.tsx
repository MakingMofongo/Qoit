import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#1a1915",
          gap: 102,
        }}
      >
        <div
          style={{
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "#faf9f7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 102,
              height: 102,
              borderRadius: "50%",
              background: "#1a1915",
            }}
          />
        </div>
        <span
          style={{
            fontSize: 205,
            fontWeight: 600,
            color: "#faf9f7",
            letterSpacing: "-0.02em",
          }}
        >
          qoit.page
        </span>
      </div>
    ),
    { width: 3840, height: 2160 }
  );
}

