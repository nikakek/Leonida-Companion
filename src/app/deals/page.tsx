import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Deals",
  robots: { index: false, follow: true },
};

export default function DealsPage() {
  return (
    <ComingSoon title="Deals">
      <p>Gift cards, storage and controllers, with clearly labeled affiliate links.</p>
    </ComingSoon>
  );
}
