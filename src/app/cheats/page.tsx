import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { AdSlot } from "@/components/AdSlot";
import { OnThisPage } from "@/components/OnThisPage";
import { PageIntro } from "@/components/PageIntro";
import { PlatformToggle } from "@/components/PlatformToggle";
import { ButtonGuide } from "@/components/cheats/ButtonGuide";
import { CheatsBrowser } from "@/components/cheats/CheatsBrowser";
import { JsonLd } from "@/components/JsonLd";
import { VerificationNote } from "@/components/VerificationNote";
import { SubmitTrigger } from "@/components/submit/SubmitTrigger";
import { siteConfig } from "@/config/site";
import { cheats, hasVerifiedCombo } from "@/data/cheats";
import { formatDate } from "@/lib/format";
import { GAME_NAME, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { countByStatus, latestVerified } from "@/lib/verification";

export const metadata: Metadata = pageMetadata({
  title: `${GAME_NAME} Cheat Codes for PS5 and Xbox Series X|S: What Is Verified`,
  description: `${GAME_NAME} cheat codes for PS5 and Xbox Series X|S: how many are verified, when codes can be confirmed, how cheats worked in earlier games, and a button guide for both controllers. Updated from launch day.`,
  path: "/cheats",
  image: "/cheats/opengraph-image",
});

const { confirmed: verified } = countByStatus(cheats);
const updated = latestVerified(cheats);
const ps5Verified = cheats.filter((cheat) => hasVerifiedCombo(cheat, "ps5")).length;
const xboxVerified = cheats.filter((cheat) => hasVerifiedCombo(cheat, "xbox")).length;
const noneVerified = verified === 0;

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Cheats", href: "/cheats" },
];

const toc = [
  { id: "cheat-list", label: "Cheat List" },
  { id: "when-title", label: "When Cheats Come Out" },
  { id: "ps5-title", label: "PS5 Cheats" },
  { id: "xbox-title", label: "Xbox Series X|S Cheats" },
  { id: "earlier-title", label: "Cheats in Earlier Games" },
  { id: "verify-title", label: "How We Verify" },
  { id: "cheat-faq-title", label: "Questions" },
];

const faqs = [
  {
    question: `Are there cheat codes in ${GAME_NAME}?`,
    answer: noneVerified
      ? `Not verified yet. No ${GAME_NAME} cheat code has been confirmed in-game or by Rockstar Games on this page, so no button combo is shown. Each slot stays marked Testing at Launch until it is checked on a real console.`
      : `${verified} of the ${cheats.length} entries on this page are confirmed. The rest stay marked Testing at Launch until they are checked on a real console.`,
  },
  {
    question: `When will ${GAME_NAME} cheats be known?`,
    answer: `Codes can only be confirmed once the game is playable. ${GAME_NAME} launches on ${siteConfig.launchLabel}, and testing on this page starts that day. A code is added only after it works on a real PS5 or Xbox Series X|S.`,
  },
  {
    question: `How do you enter cheats on PS5 and Xbox Series X|S?`,
    answer: `Not verified yet for ${GAME_NAME}. Earlier games in the series used controller button sequences, so this page has a button guide for both controllers and a PlayStation / Xbox switch. The input method is confirmed here once it is tested at launch.`,
  },
  {
    question: `Will GTA 5 cheat codes work in ${GAME_NAME}?`,
    answer: `Not verified yet. GTA 5 codes belong to a different game, so this page does not list them as ${GAME_NAME} codes. If any old code turns out to work, it is added here once tested.`,
  },
  {
    question: `Is there a ${GAME_NAME} money cheat?`,
    answer: `Not verified yet. No money cheat is confirmed. Be careful with sites, videos or apps that promise one before launch, especially if they ask you to log in or download something.`,
  },
  {
    question: "Can cheats be used online?",
    answer: `Not verified yet for ${GAME_NAME}. In GTA 5, cheats worked in story mode only and not in GTA Online.`,
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

function GuideSection({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-12 max-w-2xl scroll-mt-28">
      <p className="eyebrow mb-2">{eyebrow}</p>
      <h2 id={id} className="section-title mb-4">
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-[16px] leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export default function CheatsPage() {
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
      <PageIntro title={`${GAME_NAME} Cheat Codes`} eyebrow={`${cheats.length} slots · ${verified} verified`}>
        <p>
          {noneVerified
            ? `No ${GAME_NAME} cheat code is verified yet. This page lists the cheats people look for most, explains when codes can be confirmed, and fills in real PS5 and Xbox Series X|S combos from launch day, only after each one is tested.`
            : `${verified} ${GAME_NAME} cheat ${verified === 1 ? "code is" : "codes are"} verified on PS5 and Xbox Series X|S. Pick your console, search, and star what you use.`}
        </p>
      </PageIntro>
      <VerificationNote updated={updated} allConfirmed={verified === cheats.length}>
        {noneVerified
          ? `No ${GAME_NAME} cheat code is confirmed. The ${cheats.length} slots below are placeholders with no button combos.`
          : `${verified} of ${cheats.length} entries are confirmed. The rest have no button combos yet.`}
      </VerificationNote>

      <dl className="mb-8 grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "Verified codes", value: `${verified} of ${cheats.length}` },
          { label: "PS5", value: `${ps5Verified} verified` },
          { label: "Xbox Series X|S", value: `${xboxVerified} verified` },
          { label: "Testing starts", value: siteConfig.launchLabel },
        ].map((stat) => (
          <div key={stat.label} className="panel p-3">
            <dt className="font-mono text-[10px] tracking-[0.12em] text-faint uppercase">{stat.label}</dt>
            <dd className="mt-1 font-mono text-[14px] text-fg">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <OnThisPage items={toc} />

      <div id="cheat-list" className="scroll-mt-28 sticky top-[calc(var(--header-h)+env(safe-area-inset-top)+0.5rem)] z-30 mb-5 max-w-xl">
        <PlatformToggle />
      </div>
      <CheatsBrowser />
      <ButtonGuide />

      <GuideSection id="when-title" eyebrow="Release" title={`When Will ${GAME_NAME} Cheats Come Out?`}>
        <p>
          A cheat code can only be confirmed by entering it in the game, so nothing can be verified before {GAME_NAME} is
          playable on {siteConfig.launchLabel}. Lists that appear before then are guesses, or codes from older games.
        </p>
        <p>
          We have not found an official cheat list from Rockstar Games as of {formatDate(updated)}. Expect this page to fill
          in gradually from launch day, one tested code at a time.
        </p>
        <p>
          See the <Link href="/release-date" className="text-link">{GAME_NAME} release date page</Link> for launch details,
          and <Link href="/news" className="text-link">{GAME_NAME} news</Link> for updates.
        </p>
      </GuideSection>

      <GuideSection id="ps5-title" eyebrow="PlayStation 5" title={`${GAME_NAME} Cheats on PS5`}>
        <p>
          {ps5Verified === 0
            ? "No PS5 combo is verified yet."
            : `${ps5Verified} PS5 ${ps5Verified === 1 ? "combo is" : "combos are"} verified.`}{" "}
          When codes are confirmed, PS5 combos are shown with PlayStation button names (Triangle, Circle, Cross, Square, L1,
          L2, R1, R2 and the d-pad), and a copy button appears next to each verified combo.
        </p>
        <p>
          Choose PlayStation in the switch above the list and the page remembers it on this device. Whether {GAME_NAME} uses
          button sequences, the in-game phone or something new is not verified yet.
        </p>
      </GuideSection>

      <GuideSection id="xbox-title" eyebrow="Xbox Series X|S" title={`${GAME_NAME} Cheats on Xbox Series X|S`}>
        <p>
          {xboxVerified === 0
            ? "No Xbox Series X|S combo is verified yet."
            : `${xboxVerified} Xbox ${xboxVerified === 1 ? "combo is" : "combos are"} verified.`}{" "}
          Xbox combos use Xbox button names (Y, B, A, X, LB, LT, RB, RT and the d-pad) and are tested separately from PS5,
          so a code can be confirmed on one console before the other.
        </p>
        <p>
          There is no PC section: Rockstar has announced {GAME_NAME} for PS5 and Xbox Series X|S only. See{" "}
          <Link href="/news/pc-version-not-announced" className="text-link">
            the PC version status
          </Link>
          .
        </p>
      </GuideSection>

      <GuideSection id="earlier-title" eyebrow="Background" title="How Cheats Worked in Earlier GTA Games">
        <p>
          In GTA 5, console players entered cheats as button sequences during gameplay, or by dialing numbers on the
          in-game phone. PC players could also type them. Cheats worked in story mode only, not in GTA Online.
        </p>
        <p>
          That history is why the list above is ready for controller combos on both consoles. None of it is verified for{" "}
          {GAME_NAME}, and older codes are not listed here as {GAME_NAME} codes.
        </p>
      </GuideSection>

      <GuideSection id="verify-title" eyebrow="Method" title="How We Verify a Cheat">
        <ol className="flex list-decimal flex-col gap-2 pl-5">
          <li>A code is entered on a real PS5 or Xbox Series X|S in the released game.</li>
          <li>If it works, the entry is marked Confirmed with the test date, and its combo and copy button appear.</li>
          <li>Only confirmed cheats get their own indexable page; placeholders stay out of search results.</li>
        </ol>
        <p>
          Found a working code after launch? Send it in. Every submission is checked by hand before anything is published.
        </p>
        <div>
          <SubmitTrigger className="btn-secondary btn-sm">Submit a Cheat</SubmitTrigger>
        </div>
      </GuideSection>

      <section aria-labelledby="cheat-faq-title" className="mt-12 max-w-3xl scroll-mt-28">
        <h2 id="cheat-faq-title" className="section-title mb-4">
          {GAME_NAME} Cheats: Questions
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
