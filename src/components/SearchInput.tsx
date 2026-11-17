"use client";

import { useId, useRef } from "react";
import { CloseIcon, SearchIcon } from "@/components/Icons";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  /** id of the element whose contents update as the user types. */
  controls?: string;
}

export function SearchInput({ value, onChange, label, placeholder, controls }: SearchInputProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
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
        className="h-[52px] w-full rounded-input bg-card pr-14 pl-12 text-base text-fg placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          className="absolute top-1/2 right-1.5 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:text-fg"
        >
          <CloseIcon />
        </button>
      ) : null}
    </div>
  );
}
