import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { AMAZON_ASSOCIATE_STATEMENT } from "@/config/monetization";
import { navTabs, secondaryLinks, siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="w-full px-[var(--gutter)] pt-10 pb-[calc(var(--bottom-nav-h)+6rem)] md:pb-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-xl items-start gap-4">
            <LogoMark size={36} />
            <div className="flex flex-col gap-2 text-[14px] text-muted">
              <p className="eyebrow text-faint">Unofficial fan site</p>
              <p>{siteConfig.disclaimer}</p>
              <p>{AMAZON_ASSOCIATE_STATEMENT}</p>
            </div>
          </div>
          <nav aria-label="Footer" className="grid shrink-0 grid-cols-2 gap-x-10 gap-y-1 text-[14px] whitespace-nowrap">
            <ul className="flex flex-col">
              {navTabs.map((tab) => (
                <li key={tab.href}>
                  <Link href={tab.href} className="inline-flex min-h-10 items-center text-muted transition-colors duration-150 hover:text-fg">
                    {tab.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col">
              {secondaryLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex min-h-10 items-center text-muted transition-colors duration-150 hover:text-fg">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-line pt-5 font-mono text-[11px] tracking-[0.12em] text-faint uppercase">
          <span>© {new Date().getFullYear()} {siteConfig.name}</span>
          <span>Fan-made · Not official</span>
        </div>
      </div>
    </footer>
  );
}
