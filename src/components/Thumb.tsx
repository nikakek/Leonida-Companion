import { useId } from "react";
import { seededRandom } from "@/lib/random";

interface ThumbProps {
  accent: string;
  seed: string;
  className?: string;
}

const W = 320;
const H = 180;
const BASE = 132;

interface Tower {
  x: number;
  w: number;
  top: number;
}

/** Abstract skyline: seeded towers along a waterline. */
function towers(rand: () => number): Tower[] {
  const list: Tower[] = [];
  let x = -4;
  while (x < W + 4) {
    const w = 10 + rand() * 22;
    const h = 16 + Math.pow(rand(), 1.6) * 80;
    list.push({ x, w, top: BASE - h });
    x += w + 1 + rand() * 4;
  }
  return list;
}

const towerPath = (list: Tower[]) =>
  list.map((t) => `M${t.x.toFixed(1)} ${BASE}V${t.top.toFixed(1)}H${(t.x + t.w).toFixed(1)}V${BASE}Z`).join("");

/** Sparse lit windows on the taller towers. */
function windows(list: Tower[], rand: () => number): { x: number; y: number }[] {
  const lit: { x: number; y: number }[] = [];
  for (const tower of list) {
    if (BASE - tower.top < 40) continue;
    for (let y = tower.top + 6; y < BASE - 6; y += 7) {
      for (let x = tower.x + 3; x < tower.x + tower.w - 3; x += 5) {
        if (rand() > 0.86) lit.push({ x, y });
      }
    }
  }
  return lit;
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

/**
 * Original generated art: a night sky in the item's accent color, a thin horizon glow,
 * an abstract skyline with a few lit windows and optional palms. No images.
 */
export function Thumb({ accent, seed, className }: ThumbProps) {
  const id = useId();
  const rand = seededRandom(seed);
  const glowX = 20 + rand() * 60;
  const city = towers(rand);
  const lit = windows(city, rand);
  const usePalms = rand() > 0.55;
  const palms = usePalms ? [palm(rand, 30 + rand() * 60, 1), palm(rand, 220 + rand() * 70, 0.8)].join("") : "";
  const cityPath = towerPath(city);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#08080D" />
          <stop offset="0.7" stopColor="#0E1424" />
          <stop offset="1" stopColor={accent} stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx={`${glowX}%`} cy="74%" r="55%">
          <stop offset="0" stopColor={accent} stopOpacity="0.55" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={accent} stopOpacity="0.22" />
          <stop offset="1" stopColor="#08080D" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      <rect width={W} height={H} fill={`url(#${id}-glow)`} />
      <path d={cityPath} fill="#08080D" fillOpacity={usePalms ? 0.7 : 0.88} />
      {lit.map((w, i) => (
        <rect key={i} x={w.x.toFixed(1)} y={w.y.toFixed(1)} width="1.6" height="2.2" fill={i % 3 === 0 ? accent : "#FFD9A0"} fillOpacity="0.7" />
      ))}
      {palms ? <path d={palms} fill="#08080D" /> : null}
      <rect y={BASE} width={W} height={H - BASE} fill={`url(#${id}-water)`} />
      <rect y={BASE} width={W} height="1" fill={accent} fillOpacity="0.6" />
      <path d={cityPath} fill={accent} fillOpacity="0.07" transform={`translate(0 ${BASE * 2}) scale(1 -1)`} />
    </svg>
  );
}
