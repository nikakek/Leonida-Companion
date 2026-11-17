"use client";

import type { ReactNode } from "react";
import { OPEN_SUBMIT_EVENT } from "@/lib/events";

/** Any button that opens the Submit a Discovery dialog. */
export function SubmitTrigger({ className, children, label }: { className: string; children: ReactNode; label?: string }) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-label={label}
      className={className}
      onClick={(event) => {
        // Safari does not focus buttons on click; focus explicitly so the dialog can restore it on close.
        event.currentTarget.focus();
        window.dispatchEvent(new Event(OPEN_SUBMIT_EVENT));
      }}
    >
      {children}
    </button>
  );
}
