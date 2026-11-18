import { seededRandom } from "@/lib/random";

const W = 1200;
const H = 320;
const BASE = 262;

/**
 * Original decorative skyline for the home hero: two layered silhouettes, a few lit windows,
 * palms and a thin sunset horizon. Pure SVG, deterministic, no images.
 */
export function HeroSkyline({ className }: { className?: string }) {
  const rand = seededRandom("leonida-hero");
  const layer = (minH: number, maxH: number, minW: number, maxW: number) => {
    let x = -10;
    let d = "";
    const tops: { x: number; w: number; top: number }[] = [];
    while (x < W + 10) {
      const w = minW + rand() * (maxW - minW);
      const h = minH + Math.pow(rand(), 1.7) * (maxH - minH);
      const top = BASE - h;
      d += `M${x.toFixed(1)} ${BASE}V${top.toFixed(1)}H${(x + w).toFixed(1)}V${BASE}Z`;
      tops.push({ x, w, top });
      x += w + rand() * 6;
    }
    return { d, tops };
  };
  const back = layer(30, 120, 18, 40);
  const front = layer(20, 170, 14, 34);
  const lit: string[] = [];
  for (const t of front.tops) {
    if (BASE - t.top < 70) continue;
    for (let y = t.top + 8; y < BASE - 8; y += 9) {
      for (let x = t.x + 4; x < t.x + t.w - 4; x += 6) {
        if (rand() > 0.9) lit.push(`M${x.toFixed(1)} ${y.toFixed(1)}h2v3h-2z`);
      }
    }
  }
  const palm = (cx: number, s: number) => {
    const topX = cx + 10 * s;
    const topY = BASE - 120 * s;
    let d = `M${cx - 3 * s} ${BASE}Q${cx + 2 * s} ${BASE - 60 * s} ${topX - 2 * s} ${topY}L${topX + 2 * s} ${topY}Q${cx + 8 * s} ${BASE - 60 * s} ${cx + 3 * s} ${BASE}Z`;
    for (let i = 0; i < 7; i++) {
      const a = Math.PI * (1.02 + (i / 6) * 0.96);
      const len = 46 * s;
      const ex = topX + Math.cos(a) * len;
      const ey = topY + Math.sin(a) * len * 0.5 + len * 0.38;
      const mx = topX + Math.cos(a) * len * 0.5;
      const my = topY + Math.sin(a) * len * 0.5 - 8 * s;
      d += `M${topX} ${topY}Q${mx} ${my - 5 * s} ${ex} ${ey}Q${mx} ${my + 5 * s} ${topX} ${topY + 4 * s}Z`;
    }
    return d;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="hero-horizon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FF4D9D" stopOpacity="0" />
          <stop offset="0.75" stopColor="#FF4D9D" stopOpacity="0.16" />
          <stop offset="1" stopColor="#FF7A59" stopOpacity="0.32" />
        </linearGradient>
        <linearGradient id="hero-sunset" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FF4D9D" stopOpacity="0" />
          <stop offset="0.3" stopColor="#FF4D9D" />
          <stop offset="0.65" stopColor="#FF7A59" />
          <stop offset="1" stopColor="#FFB547" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hero-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3DE3F0" stopOpacity="0.08" />
          <stop offset="1" stopColor="#08080D" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect y={BASE - 150} width={W} height="150" fill="url(#hero-horizon)" />
      <path d={back.d} fill="#151528" />
      <path d={front.d} fill="#0B0B14" />
      <path d={lit.join("")} fill="#FFD9A0" fillOpacity="0.55" />
      <path d={`${palm(110, 1)}${palm(170, 0.78)}${palm(1010, 0.92)}${palm(1075, 1.1)}`} fill="#08080D" />
      <rect y={BASE} width={W} height="2" fill="url(#hero-sunset)" />
      <rect y={BASE + 2} width={W} height={H - BASE} fill="url(#hero-water)" />
    </svg>
  );
}
