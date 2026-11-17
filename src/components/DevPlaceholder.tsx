/** Clearly marked placeholder shown only in development when a config value is missing. */
export function DevPlaceholder({ label, envVar, className = "" }: { label: string; envVar: string; className?: string }) {
  return (
    <div
      className={`flex flex-col justify-center gap-1 rounded-card border border-dashed border-warn/60 p-5 text-[14px] text-warn ${className}`}
    >
      <p className="font-mono text-[11px] tracking-wide uppercase">Dev only · hidden in production</p>
      <p>
        {label}: set <code className="font-mono">{envVar}</code> to show this.
      </p>
    </div>
  );
}
