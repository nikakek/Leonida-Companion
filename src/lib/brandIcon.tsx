import { ImageResponse } from "next/og";

/**
 * Renders the original logo mark as a PNG via next/og (Satori: no CSS variables, flexbox only).
 * `maskable` keeps the mark inside the 80% safe zone on a full-bleed gradient.
 */
export function brandIcon(size: number, { maskable = false }: { maskable?: boolean } = {}) {
  const markScale = maskable ? 0.56 : 0.7;
  const mark = Math.round(size * markScale);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FF4FA3 0%, #8A4DFF 55%, #FF9A3C 100%)",
          borderRadius: maskable ? 0 : Math.round(size * 0.22),
        }}
      >
        <svg width={mark} height={mark} viewBox="10 7 22 26">
          <path d="M13 9.5h5v16h10.5v5H13z" fill="#0B0A1C" />
          <path d="M21.5 9.5c3.8 0 6.6 2.2 7.5 5.6-2.9-1.3-5.5-1.5-7.5-.6z" fill="#0B0A1C" />
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
