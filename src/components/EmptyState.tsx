import type { ReactNode } from "react";

export function EmptyState({ message, action }: { message: string; action: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-card border border-dashed border-line-strong px-6 py-12 text-center">
      <svg width="64" height="48" viewBox="0 0 64 48" fill="none" aria-hidden="true" focusable="false">
        <path d="M4 40h56" stroke="#34344A" strokeWidth="2" strokeLinecap="round" />
        <circle cx="28" cy="20" r="12" stroke="#A3A1B8" strokeWidth="2.5" />
        <path d="m37 29 9 9" stroke="#A3A1B8" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M23 20h10" stroke="#FF4D9D" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <p className="max-w-xs text-muted">{message}</p>
      {action}
    </div>
  );
}
