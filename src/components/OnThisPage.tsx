/** Jump-link table of contents for long guide pages. Plain anchors, server-rendered and crawlable. */
export function OnThisPage({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="On this page" className="panel mb-8 max-w-2xl p-4 md:p-5">
      <p className="eyebrow mb-2 text-muted">On This Page</p>
      <ol className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        {items.map((item, index) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="flex min-h-11 items-center gap-3 text-[15px] text-muted transition-colors duration-150 hover:text-fg">
              <span className="w-5 font-mono text-[11px] text-faint">{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
