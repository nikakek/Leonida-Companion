import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: `How ${siteConfig.name} handles your data: local storage, optional analytics, ads and affiliate links.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy" intro={<p>{siteConfig.name} has no accounts and no database of users. Here is what that means in practice.</p>}>
      <section>
        <h2>Data Stored on Your Device</h2>
        <p>
          We use your browser&apos;s <strong>localStorage</strong> to remember your choices on this device only:
        </p>
        <ul>
          <li>Your controller platform (PlayStation or Xbox).</li>
          <li>Your favorite cheats.</li>
          <li>Map progress and your own submissions, once those features are available.</li>
        </ul>
        <p className="mt-2">
          This data never leaves your device and is not sent to us. Clearing your browser&apos;s site data removes it.
        </p>
      </section>

      <section>
        <h2>Analytics</h2>
        <p>
          We may use a privacy-friendly analytics service (Plausible or Umami) to count page views. These tools are
          designed not to use cookies or collect personal data, and report only aggregate statistics such as page
          views, referrers, country and device type.
        </p>
      </section>

      <section>
        <h2>Advertising</h2>
        <p>
          The site currently shows no ads. If ads are added later, ad partners may use cookies or similar
          technologies to show and measure ads. Where the law requires it (for example in the EU and UK), we will ask
          for your consent before any advertising cookies are set.
        </p>
      </section>

      <section>
        <h2>Affiliate Links</h2>
        <p>
          The Deals page contains affiliate links. When you click one, the store you visit (for example Amazon) may
          set cookies to attribute a purchase to us. Their privacy policies apply on their sites. See the Affiliate
          Disclosure for details.
        </p>
      </section>

      <section>
        <h2>Hosting</h2>
        <p>
          Like any website, our hosting provider processes basic request data (such as IP address and browser type)
          to deliver pages and protect against abuse.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about privacy: <strong>{siteConfig.contactEmail}</strong>
        </p>
      </section>
    </LegalPage>
  );
}
