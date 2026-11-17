import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-start gap-5 py-12 md:py-20">
      <p className="font-mono text-[13px] text-muted">404</p>
      <h1 className="page-title">Page Not Found</h1>
      <p className="max-w-xl text-[17px] text-muted">
        This page does not exist, or it moved. Try one of the main sections instead.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
        <Link href="/cheats" className="btn-secondary">
          Cheats
        </Link>
        <Link href="/radio" className="btn-secondary">
          Radio
        </Link>
      </div>
    </section>
  );
}
