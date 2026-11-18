import type { Status } from "@/lib/types";

const styles: Record<Status, { label: string; className: string; dot: string }> = {
  confirmed: { label: "Confirmed", className: "text-ok border-ok/35", dot: "bg-ok" },
  testing: { label: "Testing at Launch", className: "text-warn border-warn/35", dot: "bg-warn" },
  sample: { label: "Sample", className: "text-sample border-dashed border-sample/60", dot: "bg-sample" },
};

/** Compact status label: present on every record, but quiet enough not to dominate. */
export function StatusBadge({ status, className = "" }: { status: Status; className?: string }) {
  const style = styles[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-[4px] border px-2 py-[3px] font-mono text-[10px] leading-none font-medium tracking-[0.1em] whitespace-nowrap uppercase ${style.className} ${className}`}
    >
      <span aria-hidden="true" className={`size-1.5 rounded-full ${style.dot}`} />
      <span className="sr-only">Status: </span>
      {style.label}
    </span>
  );
}
