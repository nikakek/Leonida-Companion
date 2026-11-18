import type { Metadata } from "next";
import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { ExternalIcon } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { PageIntro } from "@/components/PageIntro";
import { StatusBadge } from "@/components/StatusBadge";
import { VerificationNote } from "@/components/VerificationNote";
import { siteConfig } from "@/config/site";
import { sortedNews } from "@/data/news";
import { releaseFacts } from "@/data/release";
import { formatDate } from "@/lib/format";
import { GAME_NAME, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { countByStatus, latestVerified } from "@/lib/verification";

export const metadata: Metadata = pageMetadata({
  title: `${GAME_NAME} Release Date, Platforms and Pre-Load`,
  description: `${GAME_NAME} release date: Thursday, November 19, 2026 on PS5 and Xbox Series X|S. Pre-load, PC status and launch details, each linked to the official Rockstar source.`,
  path: "/release-date",
});

const { confirmed, total } = countByStatus(releaseFacts);
const updated = latestVerified(releaseFacts);

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Release Date", href: "/release-date" },
];

const faqs = [
  {
    question: `When does ${GAME_NAME} come out?`,
    answer: `Rockstar's release date for ${GAME_NAME} is Thursday, ${siteConfig.launchLabel}. It was previously set for May 26, 2026.`,
  },
  {
    question: `What platforms is ${GAME_NAME} on?`,
    answer: `PlayStation 5 and Xbox Series X|S. Rockstar has not announced versions for other consoles or PC.`,
  },
  {
    question: `Is ${GAME_NAME} coming to PC?`,
    answer: `Not announced. Rockstar has not given a PC version or date. Reports of a later PC release are unverified.`,
  },
  {
    question: `What time does ${GAME_NAME} unlock?`,
    answer: `Not verified yet. Unlock times can differ by platform and region, so check Rockstar's official posts for your console. This page does not list a time.`,
  },
  {
    question: `Can I pre-load ${GAME_NAME}?`,
    answer: `Yes. Rockstar confirmed that pre-loading opened on November 10, 2026. Its official post has the per-platform details.`,
  },
];

export default function ReleaseDatePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />
      <PageIntro title={`${GAME_NAME} Release Date`} eyebrow={`${confirmed} of ${total} facts confirmed`}>
        <p>
          {GAME_NAME} is dated for Thursday, {siteConfig.launchLabel}, on PlayStation 5 and Xbox Series X|S. Below is every
          launch detail we could check against an official Rockstar source, and a clear label on the ones we could not.
        </p>
      </PageIntro>
      <div className="mb-6">
        <Countdown />
      </div>
      <VerificationNote updated={updated} allConfirmed={confirmed === total}>
        Items marked Testing at Launch have no official answer yet and are not presented as fact.
      </VerificationNote>

      <section aria-labelledby="facts-title" className="max-w-3xl">
        <h2 id="facts-title" className="section-title mb-4">
          Launch Facts
        </h2>
        <dl className="overflow-hidden rounded-card border border-line bg-card">
          {releaseFacts.map((fact) => (
            <div key={fact.id} className="grid gap-2 border-b border-line p-4 last:border-b-0 sm:grid-cols-[11rem_1fr] md:p-5">
              <dt className="font-mono text-[12px] tracking-[0.1em] text-faint uppercase sm:pt-0.5">{fact.label}</dt>
              <dd className="flex flex-col gap-1.5">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="font-semibold">{fact.value}</span>
                  <StatusBadge status={fact.status} />
                </span>
                {fact.note ? <span className="text-[14px] text-muted">{fact.note}</span> : null}
                {fact.href || fact.sourceUrl ? (
                  <span className="flex flex-wrap gap-x-4">
                    {fact.href ? (
                      <Link href={fact.href} className="text-link inline-flex min-h-11 items-center text-[14px]">
                        Read more
                      </Link>
                    ) : null}
                    {fact.sourceUrl ? (
                      <a
                        href={fact.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link inline-flex min-h-11 items-center gap-1.5 text-[14px]"
                      >
                        Official source
                        <ExternalIcon size={14} />
                      </a>
                    ) : null}
                  </span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="timeline-title" className="mt-12 max-w-3xl">
        <h2 id="timeline-title" className="section-title mb-4">
          Timeline
        </h2>
        <ol className="flex flex-col gap-2">
          {sortedNews.map((item) => (
            <li key={item.slug}>
              <Link href={`/news/${item.slug}`} className="stripe-row flex min-h-14 flex-col gap-1 px-4 py-3 pl-5 sm:flex-row sm:items-center sm:gap-4">
                <time dateTime={item.date} className="meta w-28 shrink-0">
                  {formatDate(item.date)}
                </time>
                <span className="min-w-0 flex-1 font-medium">{item.title}</span>
                <StatusBadge status={item.status} />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="release-faq-title" className="mt-12 max-w-3xl">
        <h2 id="release-faq-title" className="section-title mb-4">
          Release Questions
        </h2>
        <dl className="overflow-hidden rounded-card border border-line bg-card">
          {faqs.map((faq) => (
            <div key={faq.question} className="border-b border-line p-4 last:border-b-0 md:p-5">
              <dt className="font-semibold">{faq.question}</dt>
              <dd className="mt-1 text-[15px] text-muted">{faq.answer}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-[15px] text-muted">
          Getting ready to play? The <Link href="/cheats" className="text-link">cheats</Link>,{" "}
          <Link href="/radio" className="text-link">radio</Link> and <Link href="/map" className="text-link">map</Link> pages
          fill in with verified finds from launch day.
        </p>
      </section>
    </>
  );
}
