import { AdUnit } from "@/components/AdUnit";
import { DevPlaceholder } from "@/components/DevPlaceholder";
import { adsense, isProduction } from "@/config/monetization";

const heights = {
  banner: "h-[100px] md:h-[90px]",
  rectangle: "h-[250px]",
} as const;

interface AdSlotProps {
  id: string;
  size: keyof typeof heights;
}

/**
 * Labeled ad space with a reserved height (no layout shift). Rules: max one per page, below the
 * main content, never between list items, no sticky overlays, pop-ups or interstitials.
 * Renders nothing in production unless both AdSense env vars are set.
 */
export function AdSlot({ id, size }: AdSlotProps) {
  if (!adsense) {
    return isProduction ? null : (
      <div className="mt-16">
        <DevPlaceholder
          label={`Ad slot "${id}"`}
          envVar="NEXT_PUBLIC_ADSENSE_CLIENT and NEXT_PUBLIC_ADSENSE_SLOT"
          className={heights[size]}
        />
      </div>
    );
  }
  return (
    <aside aria-label="Advertisement" className="mt-16">
      <p className="mb-2 text-center font-mono text-[11px] tracking-[0.12em] text-faint uppercase">Advertisement</p>
      <div data-ad-slot-id={id} className={`w-full overflow-hidden rounded-card bg-card/50 ${heights[size]}`}>
        <AdUnit client={adsense.client} slot={adsense.slot} />
      </div>
    </aside>
  );
}
