import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { AMAZON_ASSOCIATE_STATEMENT } from "@/config/monetization";
import { secondaryLinks, siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[1100px] px-5 pt-16 pb-[calc(var(--bottom-nav-h)+2rem)] md:px-8 md:pb-12">
      <div className="flex flex-col items-start gap-4 rounded-3xl border border-line-strong px-6 py-5 md:flex-row md:items-center md:gap-6 md:rounded-full md:px-10">
        <LogoMark size={32} />
        <div className="flex flex-col gap-1 text-[15px] text-muted">
          <p>{siteConfig.disclaimer}</p>
          <p>{AMAZON_ASSOCIATE_STATEMENT}</p>
        </div>
      </div>
      <nav aria-label="Legal" className="mt-6">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 px-2">
          {secondaryLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex min-h-11 items-center text-[15px] text-muted transition-colors duration-150 hover:text-fg"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="ml-auto text-[15px] text-muted">© {new Date().getFullYear()} {siteConfig.name}</li>
        </ul>
      </nav>
    </footer>
  );
}
