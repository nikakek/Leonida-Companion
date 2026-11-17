"use client";

import { useRef, type KeyboardEvent } from "react";
import { platformLabels, type Platform } from "@/data/cheats";
import { usePlatform } from "@/hooks/usePlatform";

const options: Platform[] = ["ps5", "xbox"];

/** Segmented pill with a sliding thumb. Keyboard: arrow keys move the selection. */
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
      className="relative grid w-full max-w-md grid-cols-2 rounded-full bg-card p-1"
    >
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-accent transition-transform duration-200 ease-out"
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
            className={`relative z-10 min-h-11 rounded-full px-3 text-[15px] font-semibold transition-colors duration-150 ${
              selected ? "text-on-accent" : "text-fg"
            }`}
          >
            {platformLabels[option]}
          </button>
        );
      })}
    </div>
  );
}
