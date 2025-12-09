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
          background: "#faf9f7",
          gap: 38,
        }}
      >
        {[0.3, 0.5, 0.8, 1, 0.7, 0.4, 0.6, 0.9, 0.5, 0.3, 0.2, 0.15, 0.1, 0.08, 0.06, 0.05, 0.05, 0.04, 0.04, 0.03, 0.03, 0.03, 0.02, 0.02, 0.02, 0.02].map(
          (scale, i) => {
            const isDot = scale <= 0.05;
            return (
              <div
                key={i}
                style={{
                  width: isDot ? 32 : 51,
                  height: isDot ? 32 : 960 * scale,
                  background: "#8a8780",
                  borderRadius: isDot ? 16 : 26,
                }}
              />
            );
          }
        )}
      </div>
    ),
    { width: 3840, height: 2160 }
  );
}

