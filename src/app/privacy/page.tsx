import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Privacy",
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <ComingSoon title="Privacy">
      <p>
        This site stores your preferences (platform choice and favorites) only in your browser&apos;s localStorage.
        The full privacy policy is coming soon.
      </p>
    </ComingSoon>
  );
}
