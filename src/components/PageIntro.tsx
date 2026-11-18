import type { ReactNode } from "react";

interface PageIntroProps {
  title: string;
  /** Short mono label above the title, e.g. "Field guide · 12 entries". */
  eyebrow?: string;
  children?: ReactNode;
}

export function PageIntro({ title, eyebrow, children }: PageIntroProps) {
  return (
    <div className="mb-8 max-w-2xl md:mb-10">
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <h1 className="page-title">{title}</h1>
      {children ? <div className="mt-3 text-[16px] text-muted md:text-[17px]">{children}</div> : null}
    </div>
  );
}
