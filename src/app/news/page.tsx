import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";
import { VerificationNote } from "@/components/VerificationNote";
import { NewsCard } from "@/components/news/NewsCard";
import { news, sortedNews } from "@/data/news";
import { GAME_NAME, absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { countByStatus, latestVerified } from "@/lib/verification";

export const metadata: Metadata = pageMetadata({
  title: `${GAME_NAME} News: Release, Launch and Platform Updates`,
  description: `${GAME_NAME} news in plain English: release date, pre-load, launch posts and platforms, each linked to the official Rockstar source and marked by verification status.`,
  path: "/news",
});

const { confirmed } = countByStatus(news);
const updated = latestVerified(news);

const crumbs = [
  { name: "Home", href: "/" },
  { name: "News", href: "/news" },
];

export default function NewsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: sortedNews.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(`/news/${item.slug}`),
            name: item.title,
          })),
        }}
      />
      <SectionHeader as="h1" title={`${GAME_NAME} News`} eyebrow={`${news.length} stories · ${confirmed} confirmed`} />
      <p className="mb-6 max-w-2xl text-[16px] text-muted md:text-[17px]">
        Short, original write-ups of official {GAME_NAME} announcements, each linked to its Rockstar source. Reports that
        Rockstar has not confirmed are marked <span className="text-warn">Testing at Launch</span> and say so up front.
      </p>
      <VerificationNote updated={updated} allConfirmed={confirmed === news.length}>
        {news.length - confirmed} {news.length - confirmed === 1 ? "story covers" : "stories cover"} something Rockstar has
        not confirmed. Its badge says so; nothing unconfirmed is presented as fact.
      </VerificationNote>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {sortedNews.map((item) => (
          <li key={item.slug} className="flex">
            <div className="flex-1">
              <NewsCard item={item} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
