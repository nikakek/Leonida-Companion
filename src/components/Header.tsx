import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { MenuDialog } from "@/components/MenuDialog";

export function Header() {
  return (
    <header className="site-header sticky top-0 z-40 pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-2.5 rounded-xl" aria-label="Leonida Companion home">
          <LogoMark />
          <span className="text-[17px] font-semibold tracking-[-0.01em]">Leonida Companion</span>
        </Link>
        <div className="flex items-center gap-3">
          <MenuDialog />
        </div>
      </div>
    </header>
  );
}
