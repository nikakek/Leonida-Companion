import { useId } from "react";
import { seededRandom } from "@/lib/random";

interface ThumbProps {
  accent: string;
  seed: string;
  className?: string;
}

const W = 320;
const H = 180;

/** Abstract skyline: seeded rectangles along a waterline. */
function skyline(rand: () => number): string {
  let x = -4;
  const base = 136;
  let d = "";
  while (x < W + 4) {
    const w = 10 + rand() * 22;
    const h = 18 + Math.pow(rand(), 1.6) * 78;
    const top = base - h;
    d += `M${x.toFixed(1)} ${base}V${top.toFixed(1)}H${(x + w).toFixed(1)}V${base}Z`;
    if (rand() > 0.72) {
      // Thin antenna on some towers.
      const ax = x + w / 2;
      d += `M${(ax - 0.8).toFixed(1)} ${top.toFixed(1)}V${(top - 10).toFixed(1)}H${(ax + 0.8).toFixed(1)}V${top.toFixed(1)}Z`;
    }
    x += w + 1 + rand() * 4;
  }
  return d;
}

/** Single abstract palm: curved trunk plus a fan of tapered fronds. */
function palm(rand: () => number, cx: number, scale: number): string {
  const baseY = 140;
  const lean = (rand() - 0.5) * 30 * scale;
  const topX = cx + lean;
  const topY = baseY - 92 * scale;
  let d = `M${cx - 3 * scale} ${baseY}Q${cx + lean * 0.2} ${baseY - 50 * scale} ${topX - 1.5 * scale} ${topY}L${topX + 1.5 * scale} ${topY}Q${cx + lean * 0.2 + 5 * scale} ${baseY - 50 * scale} ${cx + 3 * scale} ${baseY}Z`;
  const fronds = 6;
  for (let i = 0; i < fronds; i++) {
    const angle = Math.PI * (1.05 + (i / (fronds - 1)) * 0.9) + (rand() - 0.5) * 0.2;
    const len = (34 + rand() * 12) * scale;
    const ex = topX + Math.cos(angle) * len;
    const ey = topY + Math.sin(angle) * len * 0.55 + len * 0.35;
    const mx = topX + Math.cos(angle) * len * 0.5;
    const my = topY + Math.sin(angle) * len * 0.5 - 6 * scale;
    d += `M${topX} ${topY}Q${mx} ${my - 4 * scale} ${ex} ${ey}Q${mx} ${my + 4 * scale} ${topX} ${topY + 3 * scale}Z`;
  }
  return d;
}

/** Original generated thumbnail art: gradient mesh in the accent color plus a silhouette. No images. */
export function Thumb({ accent, seed, className }: ThumbProps) {
  const id = useId();
  const rand = seededRandom(seed);
  const blobs = Array.from({ length: 3 }, (_, i) => ({
    cx: 20 + rand() * 60,
    cy: 10 + rand() * 50,
    r: 45 + rand() * 30,
    color: i === 1 ? "#8A4DFF" : accent,
    opacity: i === 1 ? 0.45 : 0.75 - i * 0.15,
  }));
  const usePalms = rand() > 0.5;
  const city = skyline(rand);
  const palms = usePalms
    ? [palm(rand, 40 + rand() * 60, 1), palm(rand, 200 + rand() * 80, 0.8)].join("")
    : "";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {blobs.map((blob, i) => (
          <radialGradient key={i} id={`${id}-b${i}`} cx={`${blob.cx}%`} cy={`${blob.cy}%`} r={`${blob.r}%`}>
            <stop offset="0" stopColor={blob.color} stopOpacity={blob.opacity} />
            <stop offset="1" stopColor={blob.color} stopOpacity="0" />
          </radialGradient>
        ))}
        <linearGradient id={`${id}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={accent} stopOpacity="0.28" />
          <stop offset="1" stopColor="#0B0A1C" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="#1A1736" />
      {blobs.map((_, i) => (
        <rect key={i} width={W} height={H} fill={`url(#${id}-b${i})`} />
      ))}
      <path d={city} fill="#0B0A1C" fillOpacity={usePalms ? 0.45 : 0.72} />
      {palms ? <path d={palms} fill="#0B0A1C" fillOpacity="0.85" /> : null}
      <rect y="136" width={W} height={H - 136} fill={`url(#${id}-water)`} />
      <path d={city} fill="#0B0A1C" fillOpacity="0.18" transform="translate(0 272) scale(1 -1)" />
    </svg>
  );
}
