import type { SVGProps } from "react";
import type { NavIcon } from "@/config/site";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 24, ...rest }: IconProps): SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    focusable: false,
    ...rest,
  };
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base({ size: 20, ...props })}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base({ size: 20, ...props })}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base({ size: 20, ...props })}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function StarIcon({ filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base({ size: 22, ...props })} fill={filled ? "currentColor" : "none"}>
      <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...base({ size: 18, ...props })}>
      <rect x="8.5" y="8.5" width="11" height="11" rx="2.5" />
      <path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5" />
    </svg>
  );
}

export function ExternalIcon(props: IconProps) {
  return (
    <svg {...base({ size: 16, ...props })}>
      <path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
    </svg>
  );
}

export function NavGlyph({ icon, ...props }: IconProps & { icon: NavIcon }) {
  switch (icon) {
    case "cheats":
      // Controller outline with a d-pad cross and two face dots.
      return (
        <svg {...base(props)}>
          <path d="M7.5 7h9a5 5 0 0 1 4.8 6.3l-1 3.6a2.4 2.4 0 0 1-4.1 1l-2-2.3h-4.4l-2 2.3a2.4 2.4 0 0 1-4.1-1l-1-3.6A5 5 0 0 1 7.5 7Z" />
          <path d="M8 10.5v3M6.5 12h3" />
          <circle cx="15.5" cy="11" r=".6" fill="currentColor" />
          <circle cx="17" cy="13" r=".6" fill="currentColor" />
        </svg>
      );
    case "radio":
      return (
        <svg {...base(props)}>
          <rect x="3.5" y="8" width="17" height="11.5" rx="3" />
          <path d="m7 8 9.5-4" />
          <circle cx="15.5" cy="13.75" r="2.5" />
          <path d="M7 12h3M7 15.5h3" />
        </svg>
      );
    case "map":
      return (
        <svg {...base(props)}>
          <path d="M9 4.5 3.5 6.5v13l5.5-2 6 2 5.5-2v-13l-5.5 2z" />
          <path d="M9 4.5v13M15 6.5v13" />
        </svg>
      );
    case "news":
      // Folded page with a headline bar and text lines.
      return (
        <svg {...base(props)}>
          <path d="M5.5 4h10a2 2 0 0 1 2 2v12.5a1.5 1.5 0 0 0 3 0V9h-3" />
          <path d="M20.5 20H6a2.5 2.5 0 0 1-2.5-2.5V6A2 2 0 0 1 5.5 4" />
          <path d="M7 8h7M7 12h7M7 15.5h4.5" />
        </svg>
      );
    case "deals":
      return (
        <svg {...base(props)}>
          <path d="M3.5 12.2V5.5a2 2 0 0 1 2-2h6.7l8.3 8.3a2 2 0 0 1 0 2.8l-6 6a2 2 0 0 1-2.8 0z" />
          <circle cx="8.25" cy="8.25" r="1.5" />
        </svg>
      );
  }
}
