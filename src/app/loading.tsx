/** Lightweight skeleton shown during client navigation while the next page's payload loads. */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite" className="flex flex-col gap-4 py-2">
      <span className="sr-only">Loading…</span>
      <div className="skeleton h-3 w-32" />
      <div className="skeleton h-14 w-64 max-w-full" />
      <div className="skeleton h-4 w-full max-w-lg" />
      <div className="skeleton mt-4 h-[50px] w-full" />
      <div className="mt-2 grid grid-cols-1 gap-2.5 md:grid-cols-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton h-24" />
        ))}
      </div>
    </div>
  );
}
