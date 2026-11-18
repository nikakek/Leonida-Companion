"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navTabs } from "@/config/site";

/** Inline primary navigation for >=768px; the mobile equivalent is BottomNav. */
export function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="hidden h-full md:block">
      <ul className="flex h-full items-stretch">
        {navTabs.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <li key={tab.href} className="flex">
              <Link href={tab.href} aria-current={active ? "page" : undefined} className="nav-link">
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
