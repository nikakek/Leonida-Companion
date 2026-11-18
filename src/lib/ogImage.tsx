import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { Status } from "@/lib/types";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const fontDir = join(process.cwd(), "src", "assets", "fonts");

async function loadFonts() {
  const [display, body] = await Promise.all([
    readFile(join(fontDir, "BebasNeue-400.woff")),
    readFile(join(fontDir, "SpaceGrotesk-500.woff")),
  ]);
  return [
    { name: "Bebas Neue", data: display, weight: 400 as const, style: "normal" as const },
    { name: "Space Grotesk", data: body, weight: 500 as const, style: "normal" as const },
  ];
}

const statusStyle: Record<Status, { label: string; color: string; background: string; border: string }> = {
  confirmed: { label: "Confirmed", color: "#3DDC84", background: "rgba(61,220,132,0.12)", border: "rgba(61,220,132,0)" },
  testing: { label: "Testing at Launch", color: "#FFB547", background: "rgba(255,181,71,0.12)", border: "rgba(255,181,71,0)" },
  sample: { label: "Sample", color: "#A78BFA", background: "rgba(167,139,250,0)", border: "#A78BFA" },
};

interface OgInput {
  eyebrow: string;
  title: string;
  /** Optional word in the title rendered in pink. */
  highlight?: string;
  subtitle?: string;
  accent?: string;
  status?: Status;
}

/**
 * Open Graph image in the site palette. Satori limits apply: flexbox only, no CSS variables,
 * fonts from bundled files (no runtime fetch).
 */
export async function renderOgImage({ eyebrow, title, highlight, subtitle, accent = "#FF4D9D", status }: OgInput) {
  const fonts = await loadFonts();
  const badge = status ? statusStyle[status] : undefined;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#08080D",
          backgroundImage: `radial-gradient(circle at 88% 8%, ${accent}40 0%, rgba(8,8,13,0) 42%), radial-gradient(circle at 12% 0%, rgba(157,123,255,0.18) 0%, rgba(8,8,13,0) 55%)`,
          color: "#F4F2F8",
          fontFamily: "Space Grotesk",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 15,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: "linear-gradient(135deg, #FF4D9D 0%, #FF7A59 55%, #FFB547 100%)",
            }}
          >
            <svg width="38" height="44" viewBox="10 7 22 26">
              <path d="M13 9.5h5v16h10.5v5H13z" fill="#08080D" />
              <path d="M21.5 9.5c3.8 0 6.6 2.2 7.5 5.6-2.9-1.3-5.5-1.5-7.5-.6z" fill="#08080D" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Bebas Neue", fontSize: 40, lineHeight: 0.9, letterSpacing: 1 }}>LEONIDA</div>
            <div style={{ fontSize: 15, letterSpacing: 6, color: "#A3A1B8" }}>COMPANION</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                padding: "6px 14px",
                borderRadius: 4,
                border: `2px solid ${accent}`,
                color: accent,
                fontSize: 22,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </div>
            {badge ? (
              <div
                style={{
                  display: "flex",
                  padding: "6px 14px",
                  borderRadius: 4,
                  border: `2px dashed ${badge.border}`,
                  backgroundColor: badge.background,
                  color: badge.color,
                  fontSize: 22,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                {badge.label}
              </div>
            ) : null}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontFamily: "Bebas Neue",
              fontSize: 120,
              lineHeight: 0.9,
              letterSpacing: 1,
              textTransform: "uppercase",
              maxWidth: 1060,
            }}
          >
            {highlight && title.includes(highlight) ? (
              <>
                <span>{title.slice(0, title.indexOf(highlight))}</span>
                <span style={{ color: "#FF4D9D", marginLeft: 24 }}>{highlight}</span>
              </>
            ) : (
              title
            )}
          </div>
          {subtitle ? (
            <div style={{ display: "flex", fontSize: 30, color: "#A3A1B8", lineHeight: 1.35, maxWidth: 1000 }}>{subtitle}</div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", height: 3, width: 220, backgroundImage: "linear-gradient(90deg, #FF4D9D, #FF7A59, #FFB547)" }} />
          <div style={{ display: "flex", fontSize: 20, color: "#6E6C85", letterSpacing: 1 }}>
            Unofficial fan site. Not affiliated with Rockstar Games or Take-Two Interactive.
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
