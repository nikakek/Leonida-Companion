import { DevPlaceholder } from "@/components/DevPlaceholder";
import { adsEnabled, isProduction } from "@/config/monetization";

const heights = {
  banner: "h-[100px] md:h-[90px]",
  rectangle: "h-[250px]",
} as const;

interface AdSlotProps {
  id: string;
  size: keyof typeof heights;
}

/**
 * Reserved ad space. Rules: max one per page, below the main content, never between
 * list items, no sticky overlays, pop-ups or interstitials.
 * No ad network script is loaded in this build; wire a CMP (see ConsentPlaceholder) first.
 */
export function AdSlot({ id, size }: AdSlotProps) {
  if (!adsEnabled) {
    return isProduction ? null : (
      <div className="mt-16">
        <DevPlaceholder label={`Ad slot "${id}"`} envVar="NEXT_PUBLIC_ADS_ENABLED=true" className={heights[size]} />
      </div>
    );
  }
  return (
    <aside aria-label="Advertisement" className="mt-16">
      <p className="mb-2 text-center text-[12px] text-muted">Advertisement</p>
      <div data-ad-slot={id} className={`w-full overflow-hidden rounded-card bg-card/50 ${heights[size]}`} />
    </aside>
  );
}
