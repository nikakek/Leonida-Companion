"use client";

import { useEffect, useId, useRef } from "react";
import { CloseIcon, SearchIcon } from "@/components/Icons";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  /** id of the element whose contents update as the user types. */
  controls?: string;
  /** Larger hero variant. */
  size?: "md" | "lg";
  /** Press "/" anywhere to focus this field (desktop keyboards). */
  shortcut?: boolean;
}

export function SearchInput({ value, onChange, label, placeholder, controls, size = "md", shortcut = false }: SearchInputProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!shortcut) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcut]);

  const large = size === "lg";

  return (
    <div className="group relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <SearchIcon
        size={large ? 22 : 20}
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-faint transition-colors duration-150 group-focus-within:text-accent ${large ? "left-4" : "left-3.5"}`}
      />
      <input
        ref={inputRef}
        id={id}
        type="search"
        inputMode="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="search"
        aria-controls={controls}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && value) {
            event.preventDefault();
            onChange("");
          }
        }}
        className={`w-full rounded-input border border-line-strong bg-[#0b0b12] text-base text-fg transition-[border-color,box-shadow] duration-150 placeholder:text-faint hover:border-[#4a4a66] focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_rgba(255,77,157,0.18),0_0_28px_-8px_rgba(255,77,157,0.5)] focus-visible:outline-none [&::-webkit-search-cancel-button]:appearance-none ${
          large ? "h-14 pr-16 pl-12 text-[17px]" : "h-[50px] pr-14 pl-11"
        }`}
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          className="absolute top-1/2 right-1.5 flex size-11 -translate-y-1/2 items-center justify-center rounded-md text-muted transition-colors duration-150 hover:text-fg"
        >
          <CloseIcon />
        </button>
      ) : shortcut ? (
        <span aria-hidden="true" className="kbd pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 md:inline-flex">
          /
        </span>
      ) : null}
    </div>
  );
}
