import Link from "next/link";
import { DesktopNav } from "@/components/DesktopNav";
import { Wordmark } from "@/components/LogoMark";
import { MenuDialog } from "@/components/MenuDialog";
import { SubmitTrigger } from "@/components/submit/SubmitTrigger";

export function Header() {
  return (
    <header className="site-header sticky top-0 z-40 pt-[env(safe-area-inset-top)]">
      <div className="flex h-16 items-center gap-6 px-[var(--gutter)]">
        <Link href="/" className="flex shrink-0 items-center rounded-md" aria-label="Leonida Companion home">
          <Wordmark />
        </Link>
        <div className="flex h-full flex-1 items-center justify-end gap-2 md:justify-between">
          <DesktopNav />
          <div className="flex items-center gap-2">
            <SubmitTrigger className="btn-primary btn-sm hidden md:inline-flex">Submit a Discovery</SubmitTrigger>
            <MenuDialog />
          </div>
        </div>
      </div>
    </header>
  );
}
