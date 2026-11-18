import { regionPaths } from "@/components/map/geometry";
import { pinShapePaths } from "@/components/map/PinGlyph";
import { regions } from "@/config/regions";
import { pinCategories } from "@/data/pins";
import { stations } from "@/data/radio";
import { seededRandom } from "@/lib/random";

const PANEL = { fill: "#12121A", stroke: "#34344A", strokeWidth: 1 };
const LABEL = { fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: 2, fill: "#A3A1B8" };

/**
 * Original decorative hero art: three abstract panels (map, radio dial, controller buttons)
 * built from the site's own shapes. Pure SVG, deterministic, no images and no game data.
 */
export function HeroArt({ className }: { className?: string }) {
  const rand = seededRandom("leonida-hero-art");
  const bars = Array.from({ length: 34 }, () => 8 + Math.pow(rand(), 1.4) * 46);
  const pinSpots: [number, number][] = [
    [140, 150],
    [360, 180],
    [600, 200],
    [480, 480],
    [650, 520],
    [470, 880],
  ];

  return (
    <svg viewBox="0 0 560 440" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="hero-art-sunset" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FF4D9D" />
          <stop offset="0.5" stopColor="#FF7A59" />
          <stop offset="1" stopColor="#FFB547" />
        </linearGradient>
        <radialGradient id="hero-art-water" cx="60%" cy="40%" r="80%">
          <stop offset="0" stopColor="#0F1A33" />
          <stop offset="1" stopColor="#070B16" />
        </radialGradient>
      </defs>

      {/* Map panel */}
      <g transform="translate(250 8) rotate(3)">
        <rect width="290" height="330" rx="10" fill="url(#hero-art-water)" stroke="#34344A" />
        <g transform="translate(22 30) scale(0.31)">
          {regions.map((region) => (
            <path
              key={region.id}
              d={regionPaths[region.id]}
              fill={region.color}
              fillOpacity="0.16"
              stroke={region.color}
              strokeWidth="4"
              strokeLinejoin="round"
            />
          ))}
          {pinSpots.map(([x, y], index) => {
            const category = pinCategories[index % pinCategories.length];
            return (
              <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(2.6)`}>
                <circle r="14" fill="#08080D" stroke={category.color} strokeWidth="2" />
                <path d={pinShapePaths[category.id]} fill={category.color} transform="scale(0.85)" />
              </g>
            );
          })}
        </g>
        <text x="16" y="24" {...LABEL}>
          MAP
        </text>
        <path d="M0 18V10A10 10 0 0 1 10 0h8" fill="none" stroke="#FF4D9D" strokeWidth="2" />
      </g>

      {/* Radio panel */}
      <g transform="translate(14 60) rotate(-4)">
        <rect width="300" height="150" rx="10" {...PANEL} />
        <text x="16" y="26" {...LABEL}>
          RADIO
        </text>
        {stations.map((station, index) => (
          <circle key={station.slug} cx={196 + index * 16} cy="22" r="4" fill={station.accent} />
        ))}
        {bars.map((height, index) => (
          <rect key={index} x={16 + index * 8} y={100 - height} width="4" height={height} rx="1" fill="url(#hero-art-sunset)" fillOpacity={0.45 + (height / 54) * 0.55} />
        ))}
        <rect x="16" y="118" width="268" height="4" rx="2" fill="#0B0B12" />
        <rect x="16" y="118" width="150" height="4" rx="2" fill="url(#hero-art-sunset)" />
        <circle cx="166" cy="120" r="6" fill="#F4F2F8" />
      </g>

      {/* Controller buttons panel */}
      <g transform="translate(40 250) rotate(2)">
        <rect width="330" height="170" rx="10" {...PANEL} />
        <text x="16" y="26" {...LABEL}>
          CHEATS
        </text>
        <g fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <rect key={index} x={16 + index * 50} y="48" width="42" height="42" rx="8" fill="#0B0B12" stroke="#34344A" strokeWidth="1" />
          ))}
          <path d="M37 59l9 16H28z" stroke="#3DDC84" />
          <circle cx="87" cy="69" r="9" stroke="#FF6B81" />
          <path d="M129 61l16 16m0-16-16 16" stroke="#3DE3F0" />
          <rect x="179" y="61" width="16" height="16" stroke="#FF4D9D" />
          <path d="M237 77V61m-7 7 7-7 7 7" stroke="#A3A1B8" />
          <path d="M279 69h16m-7-7 7 7-7 7" stroke="#A3A1B8" />
        </g>
        <rect x="16" y="112" width="190" height="8" rx="2" fill="#22222F" />
        <rect x="16" y="130" width="120" height="8" rx="2" fill="#22222F" />
        <rect x="226" y="108" width="88" height="34" rx="6" fill="none" stroke="#FFB547" strokeOpacity="0.5" strokeDasharray="4 4" />
        <circle cx="242" cy="125" r="3.5" fill="#FFB547" />
        <rect x="252" y="121" width="50" height="8" rx="2" fill="#FFB547" fillOpacity="0.35" />
      </g>
    </svg>
  );
}
