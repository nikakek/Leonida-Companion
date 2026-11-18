import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ExternalIcon } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { StatusBadge } from "@/components/StatusBadge";
import { VerificationNote } from "@/components/VerificationNote";
import { NewsCard } from "@/components/news/NewsCard";
import { siteConfig } from "@/config/site";
import { getNewsItem, news, newsSources, newsTagAccents, sortedNews } from "@/data/news";
import { formatDate } from "@/lib/format";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return news.map((item) => ({ slug: item.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsItem(slug);
  if (!item) return {};
  return pageMetadata({ title: item.title, description: item.summary, path: `/news/${item.slug}` });
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const item = getNewsItem(slug);
  if (!item) notFound();

  const sources = newsSources(item);
  const confirmed = item.status === "confirmed";
  const accent = newsTagAccents[item.tag];
  const more = sortedNews.filter((other) => other.slug !== item.slug).slice(0, 3);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "News", href: "/news" },
    { name: item.title, href: `/news/${item.slug}` },
  ];

  return (
    <article>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: item.title,
          description: item.summary,
          datePublished: item.date,
          dateModified: item.lastVerified,
          mainEntityOfPage: absoluteUrl(`/news/${item.slug}`),
          author: { "@type": "Organization", name: siteConfig.name, url: absoluteUrl("/") },
          publisher: { "@type": "Organization", name: siteConfig.name, url: absoluteUrl("/") },
          ...(sources.length > 0 ? { citation: sources.map((source) => source.url) } : {}),
        }}
      />

      <Breadcrumbs items={crumbs} />
      <header className="mb-6 max-w-2xl">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <time dateTime={item.date} className="meta">
            {formatDate(item.date)}
          </time>
          <span className="font-mono text-[11px] tracking-[0.12em] uppercase" style={{ color: accent }}>
            {item.tag}
          </span>
          <StatusBadge status={item.status} />
        </div>
        <h1 className="page-title">{item.title}</h1>
        <p className="mt-4 text-[17px] text-fg/90 md:text-[18px]">{item.summary}</p>
      </header>

      {confirmed ? null : (
        <VerificationNote updated={item.lastVerified}>
          Rockstar has not confirmed this. The story explains what is known and will be updated if an official source appears.
        </VerificationNote>
      )}

      <div className="flex max-w-2xl flex-col gap-4 text-[16px] leading-relaxed text-muted md:text-[17px]">
        {item.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <section aria-labelledby="sources-title" className="panel mt-10 max-w-2xl p-4 md:p-6">
        <h2 id="sources-title" className="eyebrow mb-3">
          Official Sources
        </h2>
        {sources.length > 0 ? (
          <ul className="flex flex-col gap-1">
            {sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link inline-flex min-h-11 items-center gap-2 text-[15px]"
                >
                  {source.label}
                  <ExternalIcon size={14} />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[15px] text-muted">Not verified yet: no official Rockstar source covers this.</p>
        )}
        <p className="meta mt-3">
          Last checked <time dateTime={item.lastVerified}>{formatDate(item.lastVerified)}</time> · Written by {siteConfig.name}, an
          unofficial fan site.
        </p>
      </section>

      {more.length > 0 ? (
        <section aria-labelledby="more-news-title" className="mt-12">
          <h2 id="more-news-title" className="section-title mb-4">
            More News
          </h2>
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {more.map((other) => (
              <li key={other.slug} className="flex">
                <div className="flex-1">
                  <NewsCard item={other} headingLevel="h3" />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
