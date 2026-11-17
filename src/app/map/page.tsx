import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Map",
  description: "A stylized map of Leonida with discoveries and progress tracking. Coming soon.",
  path: "/map",
  noindex: true,
});

export default function MapPage() {
  return (
    <div id="submit">
      <ComingSoon title="Map">
        <p>A stylized map of Leonida with discoveries and progress tracking. Discovery submissions open here soon.</p>
      </ComingSoon>
    </div>
  );
}
