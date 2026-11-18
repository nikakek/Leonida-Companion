import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { StatusBadge } from "@/components/StatusBadge";
import { SubmitTrigger } from "@/components/submit/SubmitTrigger";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: `About ${siteConfig.name}, an unofficial fan-made companion site, and how entries are verified.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="max-w-2xl">
      <PageIntro title="About" eyebrow="Fan-made · Unofficial">
        <p>
          {siteConfig.name} is a fan-made companion for quick lookups while you play: cheats, radio songs, the map
          and more. It is built for phones and dim rooms.
        </p>
      </PageIntro>

      <section aria-labelledby="disclaimer-title" className="panel mb-10 p-5 md:p-6">
        <h2 id="disclaimer-title" className="eyebrow mb-3">
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
          <li className="panel flex flex-col gap-2 p-4">
            <StatusBadge status="confirmed" className="self-start" />
            <p className="text-muted">Verified in-game or from an official Rockstar source.</p>
          </li>
          <li className="panel flex flex-col gap-2 p-4">
            <StatusBadge status="testing" className="self-start" />
            <p className="text-muted">Reported or expected, but not yet verified. Treat it as unconfirmed.</p>
          </li>
          <li className="panel flex flex-col gap-2 p-4">
            <StatusBadge status="sample" className="self-start" />
            <p className="text-muted">Example content that shows how a feature works. Not real game data.</p>
          </li>
        </ul>
        <p className="mt-4 text-muted">
          If something is unknown, we say &ldquo;Not verified yet&rdquo; instead of guessing. Spotted a mistake?{" "}
          <SubmitTrigger className="text-link">Submit a correction</SubmitTrigger>.
        </p>
      </section>
    </div>
  );
}
