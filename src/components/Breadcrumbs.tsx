import Link from "next/link";

export interface Crumb {
  name: string;
  href: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-2 font-mono text-[12px] tracking-[0.08em] text-muted uppercase">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-fg">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="inline-flex min-h-11 items-center hover:text-fg">
                    {item.name}
                  </Link>
                  <span aria-hidden="true" className="text-faint">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
