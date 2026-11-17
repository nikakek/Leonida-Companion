import type { PinCategoryId } from "@/data/pins";

/** Shape paths centered on 0,0 within roughly an 8-unit radius. Shapes differ per category (not color-only). */
export const pinShapePaths: Record<PinCategoryId, string> = {
  // Five-point star
  "easter-egg": "M0 -9 L2.6 -3.2 L8.6 -2.8 L4 1.2 L5.3 7.3 L0 4.2 L-5.3 7.3 L-4 1.2 L-8.6 -2.8 L-2.6 -3.2Z",
  // Diamond
  collectible: "M0 -9 L8 0 L0 9 L-8 0Z",
  // Upward chevron (ramp)
  "stunt-jump": "M-8.5 5 L0 -6.5 L8.5 5 L4.5 8 L0 2 L-4.5 8Z",
  // House
  "safe-house": "M-8 -0.5 L0 -8.5 L8 -0.5 L8 8 L-8 8Z",
};

/** Small inline icon for chips and lists. */
export function PinGlyph({ category, color, size = 18 }: { category: PinCategoryId; color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-10 -10 20 20" aria-hidden="true" focusable="false" className="shrink-0">
      <path d={pinShapePaths[category]} fill={color} />
    </svg>
  );
}
