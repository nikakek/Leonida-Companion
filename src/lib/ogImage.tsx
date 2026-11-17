import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import type { Status } from "@/lib/types";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const fontDir = join(process.cwd(), "src", "assets", "fonts");

async function loadFonts() {
  const [medium, semibold] = await Promise.all([
    readFile(join(fontDir, "Figtree-500.woff")),
    readFile(join(fontDir, "Figtree-600.woff")),
  ]);
  return [
    { name: "Figtree", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Figtree", data: semibold, weight: 600 as const, style: "normal" as const },
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
export async function renderOgImage({ eyebrow, title, highlight, subtitle, accent = "#FF4FA3", status }: OgInput) {
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
          backgroundColor: "#0B0A1C",
          backgroundImage: `radial-gradient(circle at 85% 10%, ${accent}55 0%, rgba(11,10,28,0) 45%), radial-gradient(circle at 20% 0%, #1B1740 0%, rgba(11,10,28,0) 60%)`,
          color: "#FFFFFF",
          fontFamily: "Figtree",
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
              backgroundImage: "linear-gradient(135deg, #FF4FA3 0%, #8A4DFF 55%, #FF9A3C 100%)",
            }}
          >
            <svg width="38" height="44" viewBox="10 7 22 26">
              <path d="M13 9.5h5v16h10.5v5H13z" fill="#0B0A1C" />
              <path d="M21.5 9.5c3.8 0 6.6 2.2 7.5 5.6-2.9-1.3-5.5-1.5-7.5-.6z" fill="#0B0A1C" />
            </svg>
          </div>
          <div style={{ fontSize: 30, fontWeight: 600 }}>{siteConfig.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                padding: "8px 22px",
                borderRadius: 999,
                backgroundColor: "#FF9CCB",
                color: "#0B0A1C",
                fontSize: 26,
                fontWeight: 600,
              }}
            >
              {eyebrow}
            </div>
            {badge ? (
              <div
                style={{
                  display: "flex",
                  padding: "8px 20px",
                  borderRadius: 999,
                  border: `2px dashed ${badge.border}`,
                  backgroundColor: badge.background,
                  color: badge.color,
                  fontSize: 22,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {badge.label}
              </div>
            ) : null}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: 76, fontWeight: 500, lineHeight: 1.08, maxWidth: 1000 }}>
            {highlight && title.includes(highlight) ? (
              <>
                <span>{title.slice(0, title.indexOf(highlight))}</span>
                <span style={{ color: "#FF9CCB", marginLeft: 18 }}>{highlight}</span>
              </>
            ) : (
              title
            )}
          </div>
          {subtitle ? (
            <div style={{ display: "flex", fontSize: 32, color: "#B9B5D6", lineHeight: 1.35, maxWidth: 1000 }}>{subtitle}</div>
          ) : null}
        </div>

        <div style={{ display: "flex", fontSize: 22, color: "#B9B5D6" }}>
          Unofficial fan site. Not affiliated with Rockstar Games or Take-Two Interactive.
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
