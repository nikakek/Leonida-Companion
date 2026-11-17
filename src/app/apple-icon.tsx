import { brandIcon } from "@/lib/brandIcon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  // Apple applies its own rounding, so use the full-bleed variant.
  return brandIcon(180, { maskable: true });
}
