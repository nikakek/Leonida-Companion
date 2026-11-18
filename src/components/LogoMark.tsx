import { useId } from "react";

/** Original logo mark: a rounded gradient square with a cut "L" and a small frond notch. */
export function LogoMark({ size = 36 }: { size?: number }) {
  const gradientId = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="shrink-0" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF4D9D" />
          <stop offset="0.55" stopColor="#FF7A59" />
          <stop offset="1" stopColor="#FFB547" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#${gradientId})`} />
      <path
        d="M13 9.5h5v16h10.5v5H13z"
        fill="#08080D"
      />
      <path d="M21.5 9.5c3.8 0 6.6 2.2 7.5 5.6-2.9-1.3-5.5-1.5-7.5-.6z" fill="#08080D" />
    </svg>
  );
}

export function Wordmark({ size = 34 }: { size?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className="flex flex-col leading-none">
        <span className="display text-[22px] leading-[0.85] tracking-[0.04em]">Leonida</span>
        <span className="font-mono text-[9.5px] tracking-[0.32em] text-muted uppercase">Companion</span>
      </span>
    </span>
  );
}
