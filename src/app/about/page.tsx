import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { StatusBadge } from "@/components/StatusBadge";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name}, an unofficial fan-made companion site, and how entries are verified.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl">
      <PageIntro title="About">
        <p>
          {siteConfig.name} is a fan-made companion for quick lookups while you play: cheats, radio songs, the map
          and more. It is built for phones and dim rooms.
        </p>
      </PageIntro>

      <section aria-labelledby="disclaimer-title" className="mb-10 rounded-card bg-card p-5 md:p-8">
        <h2 id="disclaimer-title" className="card-title mb-2">
          Fan Site Disclaimer
        </h2>
        <p className="text-muted">{siteConfig.disclaimer}</p>
        <p className="mt-3 text-muted">
          No official logos, artwork, screenshots or lyrics are used. All illustrations on this site are original
          generated art.
        </p>
      </section>

      <section aria-labelledby="status-title" className="mb-10">
        <h2 id="status-title" className="section-title mb-4">
          How We Label Entries
        </h2>
        <ul className="flex flex-col gap-3">
          <li className="flex flex-col gap-2 rounded-2xl bg-card p-5">
            <StatusBadge status="confirmed" className="self-start" />
            <p className="text-muted">Verified in-game or from an official Rockstar source.</p>
          </li>
          <li className="flex flex-col gap-2 rounded-2xl bg-card p-5">
            <StatusBadge status="testing" className="self-start" />
            <p className="text-muted">Reported or expected, but not yet verified. Treat it as unconfirmed.</p>
          </li>
          <li className="flex flex-col gap-2 rounded-2xl bg-card p-5">
            <StatusBadge status="sample" className="self-start" />
            <p className="text-muted">Example content that shows how a feature works. Not real game data.</p>
          </li>
        </ul>
        <p className="mt-4 text-muted">
          If something is unknown, we say &ldquo;Not verified yet&rdquo; instead of guessing. Spotted a mistake? See
          the <Link href="/map#submit" className="text-link">submissions page</Link>.
        </p>
      </section>
    </div>
  );
}
