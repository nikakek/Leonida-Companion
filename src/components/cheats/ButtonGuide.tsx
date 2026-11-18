"use client";

import { ControllerBadge } from "@/components/ControllerBadge";
import { buttonNames, platformLabels, ps5Buttons, xboxButtons } from "@/data/cheats";
import { usePlatform } from "@/hooks/usePlatform";

/** Shows every controller badge for the selected platform so the combo format is visible without fake data. */
export function ButtonGuide() {
  const [platform] = usePlatform();
  const item = "flex min-h-14 items-center gap-3 rounded-md border border-line bg-[#0b0b12] px-3";
  return (
    <section aria-labelledby="button-guide-title" className="panel mt-12 p-4 md:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="eyebrow mb-2">Reference</p>
          <h2 id="button-guide-title" className="section-title">
            Button Guide
          </h2>
        </div>
        <p className="font-mono text-[12px] text-muted">How combos will look on {platformLabels[platform]}</p>
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 2xl:grid-cols-12">
        {platform === "ps5"
          ? ps5Buttons.map((button) => (
              <li key={button} className={item}>
                <ControllerBadge platform="ps5" button={button} />
                <span className="font-mono text-[12px] text-muted">{buttonNames[button]}</span>
              </li>
            ))
          : xboxButtons.map((button) => (
              <li key={button} className={item}>
                <ControllerBadge platform="xbox" button={button} />
                <span className="font-mono text-[12px] text-muted">{buttonNames[button]}</span>
              </li>
            ))}
      </ul>
    </section>
  );
}
