import { buttonNames, type Ps5Btn, type XboxBtn } from "@/data/cheats";

type ControllerBadgeProps =
  | { platform: "ps5"; button: Ps5Btn; size?: number }
  | { platform: "xbox"; button: XboxBtn; size?: number };

const DARK = "#1A1830";

const ps5Face: Partial<Record<Ps5Btn, string>> = {
  triangle: "#2DD4A7",
  circle: "#FF4D5E",
  cross: "#5B8DFF",
  square: "#FF7AC8",
};

const xboxFace: Partial<Record<XboxBtn, { fill: string; letter: string }>> = {
  y: { fill: "#F5C518", letter: "#0B0A1C" },
  b: { fill: "#E5322D", letter: "#FFFFFF" },
  a: { fill: "#3FB950", letter: "#0B0A1C" },
  x: { fill: "#1E6FE8", letter: "#FFFFFF" },
};

const shoulders = new Set(["l1", "l2", "r1", "r2", "lb", "lt", "rb", "rt"]);
const arrowRotation: Record<string, number> = { up: 0, right: 90, down: 180, left: 270 };

function Ps5Symbol({ button, color }: { button: Ps5Btn; color: string }) {
  const stroke = { stroke: color, strokeWidth: 2.2, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (button) {
    case "triangle":
      return <path d="M16 9.5 22.5 21h-13z" {...stroke} />;
    case "circle":
      return <circle cx="16" cy="16" r="6.25" {...stroke} />;
    case "cross":
      return <path d="m10.75 10.75 10.5 10.5m0-10.5-10.5 10.5" {...stroke} />;
    case "square":
      return <rect x="10.25" y="10.25" width="11.5" height="11.5" rx="1" {...stroke} />;
    default:
      return null;
  }
}

/** Crisp inline-SVG controller button. 32px tall by default, scales with `size`. */
export function ControllerBadge(props: ControllerBadgeProps) {
  const { platform, button, size = 32 } = props;
  const name = buttonNames[button];
  const label = `${platform === "ps5" ? "PlayStation" : "Xbox"} ${name}`;

  if (shoulders.has(button)) {
    const width = (size * 46) / 32;
    return (
      <span className="inline-flex shrink-0 align-middle" role="img" aria-label={label}>
        <svg width={width} height={size} viewBox="0 0 46 32" aria-hidden="true" focusable="false">
          <rect x="1" y="5" width="44" height="22" rx="11" fill={DARK} stroke="#4A4580" strokeWidth="1.25" />
          <text
            x="23"
            y="20.5"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="12.5"
            fontWeight="600"
            fontFamily="var(--font-jetbrains-mono), ui-monospace, monospace"
          >
            {name}
          </text>
        </svg>
        <span className="sr-only">{label}</span>
      </span>
    );
  }

  if (button in arrowRotation) {
    return (
      <span className="inline-flex shrink-0 align-middle" role="img" aria-label={label}>
        <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
          <rect x="2" y="2" width="28" height="28" rx="8" fill={DARK} stroke="#4A4580" strokeWidth="1.25" />
          <path
            d="M16 9.5 22 17h-3.75v5.5h-4.5V17H10z"
            fill="#FFFFFF"
            transform={`rotate(${arrowRotation[button]} 16 16)`}
          />
        </svg>
        <span className="sr-only">{label}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 align-middle" role="img" aria-label={label}>
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        {props.platform === "ps5" ? (
          <>
            <circle cx="16" cy="16" r="15" fill={DARK} stroke="#4A4580" strokeWidth="1.25" />
            <Ps5Symbol button={props.button} color={ps5Face[props.button] ?? "#FFFFFF"} />
          </>
        ) : (
          <>
            <circle cx="16" cy="16" r="15" fill={xboxFace[props.button]?.fill ?? DARK} />
            <text
              x="16"
              y="21.5"
              textAnchor="middle"
              fill={xboxFace[props.button]?.letter ?? "#FFFFFF"}
              fontSize="16"
              fontWeight="600"
              fontFamily="var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif"
            >
              {name}
            </text>
          </>
        )}
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

type ComboBadgesProps =
  | { platform: "ps5"; buttons: readonly Ps5Btn[] }
  | { platform: "xbox"; buttons: readonly XboxBtn[] };

/** Renders a full combo for one platform. Callers must check `hasVerifiedCombo` first. */
export function ComboBadges(props: ComboBadgesProps) {
  const items =
    props.platform === "ps5"
      ? props.buttons.map((button, i) => <ControllerBadge key={i} platform="ps5" button={button} />)
      : props.buttons.map((button, i) => <ControllerBadge key={i} platform="xbox" button={button} />);
  return (
    <ol className="flex flex-wrap items-center gap-1.5" aria-label="Button combo">
      {items.map((badge) => (
        <li key={badge.key} className="flex">
          {badge}
        </li>
      ))}
    </ol>
  );
}
