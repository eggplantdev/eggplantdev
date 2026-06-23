import { ImageResponse } from "next/og";

import { buildBrandDots, VIEWBOX } from "@/components/brand/brand-mark-dots";

export const contentType = "image/png";
export const size = { width: 64, height: 64 };

// Favicon = the brand mark (the neon dot grid), sharing geometry with the nav logo via
// brand-mark-dots so it tracks any reshape. No glow layer: at favicon scale the blur just
// muddies the dots and the browser-chrome background is unknown.
export default function Icon() {
  // Portrait viewBox (taller than wide) centered in the square favicon, scaled to fit by height.
  const width = Math.round((size.height * VIEWBOX.width) / VIEWBOX.height);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={width} height={size.height} viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}>
        {buildBrandDots().map((d) => (
          <circle key={`${d.cx}-${d.cy}`} cx={d.cx} cy={d.cy} r={d.r} fill={d.fill} />
        ))}
      </svg>
    </div>,
    { ...size },
  );
}
