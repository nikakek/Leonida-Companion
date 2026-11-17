import type { ReactNode } from "react";

export function PageIntro({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 max-w-2xl md:mb-10">
      <h1 className="page-title">{title}</h1>
      {children ? <div className="mt-3 text-[17px] text-muted">{children}</div> : null}
    </div>
  );
}
