import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ComboBadges } from "@/components/ControllerBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { CopyComboButton } from "@/components/cheats/CopyComboButton";
import {
  buttonNames,
  cheats,
  getCheat,
  hasVerifiedCombo,
  platformLabels,
  type Cheat,
  type Platform,
} from "@/data/cheats";
import { formatDate } from "@/lib/format";

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
  return {
    title: `${cheat.title} Cheat`,
    description: confirmed
      ? `${cheat.title} cheat button combo for PS5 and Xbox Series X|S.`
      : `${cheat.title}: not verified yet. No button combo is confirmed for this cheat slot.`,
    alternates: { canonical: `/cheats/${cheat.slug}` },
    robots: confirmed ? undefined : { index: false, follow: true },
  };
}

function PlatformCombo({ cheat, platform }: { cheat: Cheat; platform: Platform }) {
  const verified = hasVerifiedCombo(cheat, platform);
  const names = (platform === "ps5" ? cheat.inputs.ps5 : cheat.inputs.xbox).map((b) => buttonNames[b]);
  return (
    <div className="flex flex-col gap-3 rounded-card bg-card p-5 md:p-8">
      <h2 className="card-title">{platformLabels[platform]}</h2>
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
        <p className="font-mono text-[15px] text-muted">Combo not verified yet</p>
      )}
    </div>
  );
}

export default async function CheatPage({ params }: Props) {
  const { slug } = await params;
  const cheat = getCheat(slug);
  if (!cheat) notFound();

  const related = cheats.filter((item) => item.category === cheat.category && item.id !== cheat.id).slice(0, 3);

  return (
    <article>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Cheats", href: "/cheats" },
          { name: cheat.title, href: `/cheats/${cheat.slug}` },
        ]}
      />
      <header className="mb-8 max-w-2xl">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <StatusBadge status={cheat.status} />
          <span className="text-muted">{cheat.category}</span>
        </div>
        <h1 className="page-title">{cheat.title}</h1>
        <p className="mt-3 text-[17px] text-muted">{cheat.description}</p>
        <p className="mt-3 text-[15px] text-muted">Last checked {formatDate(cheat.lastVerified)}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <PlatformCombo cheat={cheat} platform="ps5" />
        <PlatformCombo cheat={cheat} platform="xbox" />
      </div>

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
                  className="flex min-h-14 items-center justify-between gap-3 rounded-2xl bg-card px-5 transition-colors duration-150 hover:bg-card-hover"
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
