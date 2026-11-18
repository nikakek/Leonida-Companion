import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-start gap-5 py-10 md:py-16">
      <p className="eyebrow">Error 404 · Off the map</p>
      <h1 className="display text-[clamp(5rem,3rem+10vw,10rem)] leading-[0.8] text-fg">
        Lost in <span className="text-accent">Leonida</span>
      </h1>
      <div className="sunset-line w-40" aria-hidden="true" />
      <p className="max-w-lg text-[16px] text-muted">This page does not exist, or it moved. Pick up the trail from one of these.</p>
      <div className="flex flex-wrap gap-2.5">
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
        <Link href="/cheats" className="btn-secondary">
          Cheats
        </Link>
        <Link href="/radio" className="btn-secondary">
          Radio
        </Link>
        <Link href="/map" className="btn-secondary">
          Map
        </Link>
      </div>
    </section>
  );
}
