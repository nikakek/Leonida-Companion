import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";
import { PageIntro } from "@/components/PageIntro";
import { PlatformToggle } from "@/components/PlatformToggle";
import { ButtonGuide } from "@/components/cheats/ButtonGuide";
import { CheatsBrowser } from "@/components/cheats/CheatsBrowser";
import { JsonLd } from "@/components/JsonLd";
import { VerificationNote } from "@/components/VerificationNote";
import { siteConfig } from "@/config/site";
import { cheats } from "@/data/cheats";
import { GAME_NAME, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { countByStatus, latestVerified } from "@/lib/verification";

export const metadata: Metadata = pageMetadata({
  title: `${GAME_NAME} Cheats for PS5 and Xbox Series X|S`,
  description: `${GAME_NAME} cheat lookup for PS5 and Xbox Series X|S with a button guide for both controllers. No code is verified yet; combos appear here only once confirmed in-game.`,
  path: "/cheats",
  image: "/cheats/opengraph-image",
});

const { confirmed: verified } = countByStatus(cheats);
const updated = latestVerified(cheats);

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Cheats", href: "/cheats" },
];

const faqs = [
  {
    question: `Are there cheat codes in ${GAME_NAME}?`,
    answer:
      verified > 0
        ? `${verified} of the ${cheats.length} entries on this page are confirmed. The rest stay marked Testing at Launch until they are checked on a real console.`
        : `Not verified yet. No ${GAME_NAME} cheat code has been confirmed in-game or by Rockstar Games on this page, so no button combo is shown. Each slot stays marked Testing at Launch until it is checked on a real console.`,
  },
  {
    question: `How do you enter cheats on PS5 and Xbox Series X|S?`,
    answer: `Not verified yet for ${GAME_NAME}. Earlier games in the series used controller button sequences, so this page has a button guide for both controllers and a PlayStation / Xbox switch. The input method is confirmed here once it is tested at launch.`,
  },
  {
    question: "Do cheats turn off trophies or achievements?",
    answer: "Not verified yet. This is checked together with the first confirmed code.",
  },
  {
    question: "When is this page updated?",
    answer: `From launch day, ${siteConfig.launchLabel}, as codes are tested. The date at the top of the page shows the last update, and every entry carries its own status badge.`,
  },
];

export default function CheatsPage() {
  return (
    <>
      <PageIntro title="Cheats" eyebrow={`${cheats.length} slots · ${verified} verified`}>
        <p>
          Pick your console, search, and star what you use. Combos appear only once verified; until then every slot is
          marked <span className="text-warn">Testing at Launch</span>.
        </p>
      </PageIntro>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <VerificationNote updated={updated} allConfirmed={verified === cheats.length}>
        {verified === 0
          ? `No ${GAME_NAME} cheat code is confirmed. The ${cheats.length} slots below are placeholders with no button combos.`
          : `${verified} of ${cheats.length} entries are confirmed. The rest have no button combos yet.`}
      </VerificationNote>
      <div className="sticky top-[calc(var(--header-h)+env(safe-area-inset-top)+0.5rem)] z-30 mb-5 max-w-xl">
        <PlatformToggle />
      </div>
      <CheatsBrowser />
      <ButtonGuide />
      <section aria-labelledby="cheat-faq-title" className="mt-12 max-w-3xl">
        <h2 id="cheat-faq-title" className="section-title mb-4">
          {GAME_NAME} Cheats: What Is Known
        </h2>
        <dl className="overflow-hidden rounded-card border border-line bg-card">
          {faqs.map((faq) => (
            <div key={faq.question} className="border-b border-line p-4 last:border-b-0 md:p-5">
              <dt className="font-semibold">{faq.question}</dt>
              <dd className="mt-1 text-[15px] text-muted">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
      <AdSlot id="cheats-bottom" size="banner" />
    </>
  );
}
