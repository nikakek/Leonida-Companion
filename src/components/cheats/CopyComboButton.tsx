"use client";

import { useState } from "react";
import { CopyIcon } from "@/components/Icons";

/** Copies a combo as plain text. Only rendered for confirmed cheats. */
export function CopyComboButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 2000);
  };

  return (
    <button type="button" onClick={copy} className="btn-secondary btn-sm">
      <CopyIcon />
      <span aria-live="polite">{state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy as text"}</span>
    </button>
  );
}
