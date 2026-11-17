import type { Status } from "@/lib/types";

const styles: Record<Status, { label: string; className: string }> = {
  confirmed: { label: "Confirmed", className: "text-ok bg-ok/12 border-transparent" },
  testing: { label: "Testing at Launch", className: "text-warn bg-warn/12 border-transparent" },
  sample: { label: "Sample", className: "text-sample border-dashed border-sample/70" },
};

export function StatusBadge({ status, className = "" }: { status: Status; className?: string }) {
  const style = styles[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 font-mono text-[11px] leading-none font-medium tracking-wide whitespace-nowrap uppercase ${style.className} ${className}`}
    >
      <span className="sr-only">Status: </span>
      {style.label}
    </span>
  );
}
