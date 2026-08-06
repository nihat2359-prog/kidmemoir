import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const size = { height: 180, width: 180 };

const logo = `data:image/svg+xml;base64,${readFileSync(
  join(process.cwd(), "public", "kidmemoir.svg"),
).toString("base64")}`;

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#ffffff",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" height={144} src={logo} width={127} />
    </div>,
    size,
  );
}
