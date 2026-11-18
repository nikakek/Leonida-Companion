import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";

interface SectionHeaderProps {
  title: string;
  id?: string;
  eyebrow?: string;
  href?: string;
  linkLabel?: string;
  as?: "h1" | "h2";
}

export function SectionHeader({ title, id, eyebrow, href, linkLabel = "View all", as: Tag = "h2" }: SectionHeaderProps) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 md:mb-6">
      <div>
        {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
        <Tag id={id} className={Tag === "h1" ? "page-title" : "section-title"}>
          {title}
        </Tag>
      </div>
      {href ? (
        <Link
          href={href}
          className="group inline-flex min-h-11 shrink-0 items-center gap-2 font-mono text-[12px] tracking-[0.12em] text-muted uppercase transition-colors duration-150 hover:text-fg"
        >
          {linkLabel}
          <ArrowRightIcon size={16} className="text-accent transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}
