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
          background: "#f5f4f0",
        }}
      >
        <div
          style={{
            width: 576,
            height: 576,
            borderRadius: "50%",
            background: "#1a1915",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 186,
              height: 186,
              borderRadius: "50%",
              background: "#f5f4f0",
            }}
          />
        </div>
      </div>
    ),
    { width: 3840, height: 2160 }
  );
}

