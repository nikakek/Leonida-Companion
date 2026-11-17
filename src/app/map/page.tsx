import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Map",
  robots: { index: false, follow: true },
};

export default function MapPage() {
  return (
    <div id="submit">
      <ComingSoon title="Map">
        <p>A stylized map of Leonida with discoveries and progress tracking. Discovery submissions open here soon.</p>
      </ComingSoon>
    </div>
  );
}
