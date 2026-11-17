import { brandIcon } from "@/lib/brandIcon";

const variants = {
  "icon-192.png": { size: 192, maskable: false },
  "icon-512.png": { size: 512, maskable: false },
  "icon-maskable-512.png": { size: 512, maskable: true },
} as const;

type VariantName = keyof typeof variants;

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(variants).map((name) => ({ name }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const variant = variants[name as VariantName];
  if (!variant) return new Response("Not found", { status: 404 });
  return brandIcon(variant.size, { maskable: variant.maskable });
}
