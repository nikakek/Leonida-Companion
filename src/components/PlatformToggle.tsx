"use client";

import { useRef, type KeyboardEvent } from "react";
import { platformLabels, type Platform } from "@/data/cheats";
import { usePlatform } from "@/hooks/usePlatform";

const options: Platform[] = ["ps5", "xbox"];

/** Generic glyphs (not brand logos): face-button shapes for PS5, a four-button diamond for Xbox. */
function PlatformGlyph({ platform }: { platform: Platform }) {
  return platform === "ps5" ? (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path d="M9 2.5 12 7.5H6z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="13" cy="12.5" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3 10 4 4m0-4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <circle cx="9" cy="3.5" r="2" fill="currentColor" />
      <circle cx="9" cy="14.5" r="2" fill="currentColor" />
      <circle cx="3.5" cy="9" r="2" fill="currentColor" />
      <circle cx="14.5" cy="9" r="2" fill="currentColor" />
    </svg>
  );
}

/** Segmented control with a sliding thumb. Keyboard: arrow keys move the selection. */
export function PlatformToggle() {
  const [platform, setPlatform] = usePlatform();
  const refs = useRef<Record<Platform, HTMLButtonElement | null>>({ ps5: null, xbox: null });
  const index = options.indexOf(platform);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = options.length - 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + options.length) % options.length;
    else next = (index + 1) % options.length;
    const value = options[next];
    setPlatform(value);
    refs.current[value]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="Controller platform"
      onKeyDown={onKeyDown}
      className="relative grid w-full grid-cols-2 rounded-[10px] border border-line-strong bg-[#0b0b12] p-1"
    >
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-[7px] bg-accent shadow-[0_0_22px_-6px_rgba(255,77,157,0.8)] transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      {options.map((option) => {
        const selected = option === platform;
        return (
          <button
            key={option}
            ref={(node) => {
              refs.current[option] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => setPlatform(option)}
            className={`relative z-10 flex min-h-11 items-center justify-center gap-2 rounded-[7px] px-2 text-[14px] font-semibold transition-colors duration-150 md:text-[15px] ${
              selected ? "text-on-accent" : "text-muted hover:text-fg"
            }`}
          >
            <PlatformGlyph platform={option} />
            {platformLabels[option]}
          </button>
        );
      })}
    </div>
  );
}
