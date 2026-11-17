import Link from "next/link";
import type { ReactNode } from "react";
import { Thumb } from "@/components/Thumb";

interface CardProps {
  href: string;
  title: string;
  accent: string;
  seed: string;
  /** Meta line pinned to the card bottom. */
  meta: ReactNode;
  /** Optional content between title and meta. */
  children?: ReactNode;
  /** Controls layered above the stretched link (e.g. a favorite button). */
  actions?: ReactNode;
  headingLevel?: "h2" | "h3";
}

/** The card pattern: 16:9 generated thumbnail, title, meta pinned to the bottom. */
export function Card({ href, title, accent, seed, meta, children, actions, headingLevel = "h3" }: CardProps) {
  const Heading = headingLevel;
  return (
    <article className="card-lift relative flex h-full flex-col overflow-hidden rounded-card bg-card">
      <Thumb accent={accent} seed={seed} className="block aspect-video w-full" />
      <div className="flex flex-1 flex-col justify-between gap-5 p-5 md:p-8">
        <div>
          <Heading className="card-title">
            <Link href={href} className="card-link">
              {title}
            </Link>
          </Heading>
          {children}
        </div>
        <div className="text-muted">{meta}</div>
      </div>
      {actions ? <div className="absolute top-3 right-3 z-10">{actions}</div> : null}
    </article>
  );
}
