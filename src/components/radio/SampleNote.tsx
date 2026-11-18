export function SampleNote() {
  return (
    <p className="inline-flex items-center gap-2 rounded-[4px] border border-dashed border-line-strong px-2.5 py-1.5 font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 7v4.5M8 4.6v.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      Preview sample, not the full playlist
    </p>
  );
}
