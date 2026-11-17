import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";

interface SectionHeaderProps {
  title: string;
  id?: string;
  href?: string;
  linkLabel?: string;
  as?: "h1" | "h2";
}

export function SectionHeader({ title, id, href, linkLabel = "View all", as: Tag = "h2" }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
      <Tag id={id} className={Tag === "h1" ? "page-title" : "section-title"}>
        {title}
      </Tag>
      {href ? (
        <Link
          href={href}
          className="group inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full text-[17px] font-medium text-fg"
        >
          {linkLabel}
          <ArrowRightIcon className="transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}
