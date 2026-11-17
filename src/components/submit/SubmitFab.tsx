import { SubmitTrigger } from "@/components/submit/SubmitTrigger";

/** Mobile floating button, sits above the bottom tab bar. */
export function SubmitFab() {
  return (
    <div className="fixed right-4 bottom-[calc(var(--bottom-nav-h)+16px)] z-30 md:hidden">
      <SubmitTrigger className="btn-primary min-h-12 px-5" label="Submit a discovery">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
        </svg>
        Submit
      </SubmitTrigger>
    </div>
  );
}
