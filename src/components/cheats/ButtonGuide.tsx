"use client";

import { ControllerBadge } from "@/components/ControllerBadge";
import { buttonNames, platformLabels, ps5Buttons, xboxButtons } from "@/data/cheats";
import { usePlatform } from "@/hooks/usePlatform";

/** Shows every controller badge for the selected platform so the combo format is visible without fake data. */
export function ButtonGuide() {
  const [platform] = usePlatform();
  return (
    <section aria-labelledby="button-guide-title" className="mt-16 rounded-card bg-card p-5 md:p-8">
      <h2 id="button-guide-title" className="card-title">
        Button Guide
      </h2>
      <p className="mt-1 text-muted">How combos will look on {platformLabels[platform]}.</p>
      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
        {platform === "ps5"
          ? ps5Buttons.map((button) => (
              <li key={button} className="flex min-h-10 items-center gap-3">
                <ControllerBadge platform="ps5" button={button} />
                <span className="font-mono text-[14px]">{buttonNames[button]}</span>
              </li>
            ))
          : xboxButtons.map((button) => (
              <li key={button} className="flex min-h-10 items-center gap-3">
                <ControllerBadge platform="xbox" button={button} />
                <span className="font-mono text-[14px]">{buttonNames[button]}</span>
              </li>
            ))}
      </ul>
    </section>
  );
}
