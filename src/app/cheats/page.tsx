import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";
import { PageIntro } from "@/components/PageIntro";
import { PlatformToggle } from "@/components/PlatformToggle";
import { ButtonGuide } from "@/components/cheats/ButtonGuide";
import { CheatsBrowser } from "@/components/cheats/CheatsBrowser";

export const metadata: Metadata = {
  title: "Cheats",
  description:
    "Cheat lookup for PS5 and Xbox Series X|S. Every entry is marked by verification status; combos appear only once confirmed.",
  alternates: { canonical: "/cheats" },
};

export default function CheatsPage() {
  return (
    <>
      <PageIntro title="Cheats">
        <p>
          Search, filter and star cheats for your platform. No cheat combos are verified yet, so every entry is
          marked <span className="text-warn">Testing at Launch</span> and shows its combo only once confirmed.
        </p>
      </PageIntro>
      <div className="sticky top-[calc(var(--header-h)+env(safe-area-inset-top)+0.5rem)] z-30 mb-6 w-full max-w-md">
        <PlatformToggle />
      </div>
      <CheatsBrowser />
      <ButtonGuide />
      <AdSlot id="cheats-bottom" size="banner" />
    </>
  );
}
