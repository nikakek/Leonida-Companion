import Link from "next/link";
import type { CSSProperties } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { newsTagAccents, type NewsItem } from "@/data/news";
import { formatDate } from "@/lib/format";

/** News list row: date, tag and status on top, then title and summary. The whole row links to the story. */
export function NewsCard({ item, headingLevel = "h2" }: { item: NewsItem; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const accent = newsTagAccents[item.tag];
  return (
    <article
      className="stripe-row card-lift relative flex h-full flex-col gap-2 p-4 pl-5 md:p-5 md:pl-6"
      style={{ "--stripe": accent } as CSSProperties}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <time dateTime={item.date} className="meta">
          {formatDate(item.date)}
        </time>
        <span className="font-mono text-[11px] tracking-[0.12em] uppercase" style={{ color: accent }}>
          {item.tag}
        </span>
        <StatusBadge status={item.status} className="ml-auto" />
      </div>
      <Heading className="card-title">
        <Link href={`/news/${item.slug}`} className="card-link">
          {item.title}
        </Link>
      </Heading>
      <p className="text-[15px] text-muted">{item.summary}</p>
    </article>
  );
}
