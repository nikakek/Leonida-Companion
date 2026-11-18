import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ComboBadges } from "@/components/ControllerBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { CopyComboButton } from "@/components/cheats/CopyComboButton";
import {
  buttonNames,
  categoryAccents,
  cheats,
  getCheat,
  hasVerifiedCombo,
  platformLabels,
  type Cheat,
  type Platform,
} from "@/data/cheats";
import { JsonLd } from "@/components/JsonLd";
import { formatDate } from "@/lib/format";
import { GAME_NAME, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return cheats.map((cheat) => ({ slug: cheat.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cheat = getCheat(slug);
  if (!cheat) return {};
  const confirmed = cheat.status === "confirmed";
  return pageMetadata({
    title: confirmed
      ? `${cheat.title} Cheat in ${GAME_NAME}: PS5 and Xbox Button Combo`
      : `${cheat.title} Cheat in ${GAME_NAME}: Not Verified Yet`,
    description: confirmed
      ? `${cheat.title} cheat in ${GAME_NAME}: the button combo for PS5 and Xbox Series X|S, verified ${cheat.lastVerified}.`
      : `${cheat.title} cheat in ${GAME_NAME}: not verified yet. No button combo is confirmed for PS5 or Xbox Series X|S.`,
    path: `/cheats/${cheat.slug}`,
    image: `/cheats/${cheat.slug}/opengraph-image`,
    // Unconfirmed cheats stay out of search results and the sitemap.
    noindex: !confirmed,
  });
}

function PlatformCombo({ cheat, platform }: { cheat: Cheat; platform: Platform }) {
  const verified = hasVerifiedCombo(cheat, platform);
  const names = (platform === "ps5" ? cheat.inputs.ps5 : cheat.inputs.xbox).map((b) => buttonNames[b]);
  return (
    <div className="panel flex flex-col gap-3 p-4 md:p-6">
      <h2 className="eyebrow text-muted">{platformLabels[platform]}</h2>
      {verified ? (
        <>
          {platform === "ps5" ? (
            <ComboBadges platform="ps5" buttons={cheat.inputs.ps5} />
          ) : (
            <ComboBadges platform="xbox" buttons={cheat.inputs.xbox} />
          )}
          <p className="font-mono text-[14px] text-muted">{names.join(", ")}</p>
          <div>
            <CopyComboButton text={names.join(", ")} />
          </div>
        </>
      ) : (
        <p className="flex min-h-11 items-center gap-2 font-mono text-[14px] text-faint">
          <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
          Combo not verified yet
        </p>
      )}
    </div>
  );
}

export default async function CheatPage({ params }: Props) {
  const { slug } = await params;
  const cheat = getCheat(slug);
  if (!cheat) notFound();

  const related = cheats.filter((item) => item.category === cheat.category && item.id !== cheat.id).slice(0, 3);
  const confirmed = cheat.status === "confirmed";
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Cheats", href: "/cheats" },
    { name: cheat.title, href: `/cheats/${cheat.slug}` },
  ];

  return (
    <article>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <header className="mb-8 max-w-2xl">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.12em] uppercase" style={{ color: categoryAccents[cheat.category] }}>
            {cheat.category} cheat
          </span>
          <StatusBadge status={cheat.status} />
        </div>
        <h1 className="page-title">{cheat.title}</h1>
        <p className="mt-3 text-[16px] text-muted md:text-[17px]">{cheat.description}</p>
        <p className="meta mt-3">Last checked {formatDate(cheat.lastVerified)}</p>
      </header>

      <div className="grid max-w-5xl grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        <PlatformCombo cheat={cheat} platform="ps5" />
        <PlatformCombo cheat={cheat} platform="xbox" />
      </div>

      <section aria-labelledby="status-title" className="mt-10 max-w-2xl">
        <h2 id="status-title" className="section-title mb-3">
          Is It Verified?
        </h2>
        {confirmed ? (
          <p className="text-muted">
            Yes. This combo was verified on {formatDate(cheat.lastVerified)}
            {cheat.sourceUrl ? (
              <>
                {" "}
                (
                <a href={cheat.sourceUrl} className="text-link" target="_blank" rel="noopener noreferrer">
                  source
                </a>
                )
              </>
            ) : null}
            . Pick your platform on the{" "}
            <Link href="/cheats" className="text-link">
              Cheats page
            </Link>{" "}
            to see combos for your console first.
          </p>
        ) : (
          <p className="text-muted">
            Not verified yet, updating at launch. No button combo for {cheat.title} in {GAME_NAME} has been verified on PS5 or Xbox Series X|S, so
            none is shown. This page will show it once it is confirmed in-game or by an official Rockstar source.
          </p>
        )}
      </section>

      {related.length > 0 ? (
        <section aria-labelledby="related-title" className="mt-12">
          <h2 id="related-title" className="section-title mb-4">
            More {cheat.category} Cheats
          </h2>
          <ul className="flex flex-col gap-2">
            {related.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/cheats/${item.slug}`}
                  className="stripe-row flex min-h-14 items-center justify-between gap-3 px-4 pl-5"
                  style={{ "--stripe": categoryAccents[item.category] } as CSSProperties}
                >
                  <span className="font-medium">{item.title}</span>
                  <StatusBadge status={item.status} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
