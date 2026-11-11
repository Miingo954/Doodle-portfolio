import { ImageResponse } from "next/og";
import { brandIconData } from "./brand-icon-data";

export const alt = "Jamal Ferguson — Full-Stack Software Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          color: "#ffffff",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <img
          src={brandIconData}
          width={280}
          height={280}
          alt=""
          style={{ objectFit: "contain" }}
        />
        <div
          style={{
            display: "flex",
            marginTop: 22,
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: 3,
          }}
        >
          JAMAL FERGUSON
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 12,
            color: "#a3a3a3",
            fontSize: 24,
            letterSpacing: 5,
          }}
        >
          FULL-STACK SOFTWARE DEVELOPER
        </div>
      </div>
    ),
    size,
  );
}
