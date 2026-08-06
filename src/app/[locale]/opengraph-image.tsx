import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "KidMemoir — Anılarınız geleceğe kalsın";
export const contentType = "image/png";
export const size = { height: 630, width: 1200 };

const logo = `data:image/svg+xml;base64,${readFileSync(
  join(process.cwd(), "public", "kidmemoir.svg"),
).toString("base64")}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background:
          "linear-gradient(135deg, #f8fafc 0%, #edf3ff 52%, #f8eef4 100%)",
        color: "#172033",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
        height: "100%",
        justifyContent: "center",
        padding: "72px",
        textAlign: "center",
        width: "100%",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" height={118} src={logo} width={104} />
      <div
        style={{
          fontSize: 68,
          fontWeight: 700,
          letterSpacing: "-3px",
          marginTop: 32,
        }}
      >
        KidMemoir
      </div>
      <div style={{ color: "#526078", fontSize: 32, marginTop: 18 }}>
        Anılarınız geleceğe kalsın.
      </div>
    </div>,
    size,
  );
}
