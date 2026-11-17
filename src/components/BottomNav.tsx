"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavGlyph } from "@/components/Icons";
import { navTabs } from "@/config/site";

/** Fixed bottom tab bar, mobile only (<768px). */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-[rgba(11,10,28,0.9)] pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto grid h-16 max-w-lg grid-cols-4">
        {navTabs.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <li key={tab.href} className="flex">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium transition-colors duration-150 ${
                  active ? "text-accent" : "text-muted hover:text-fg"
                }`}
              >
                <NavGlyph icon={tab.icon} />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
