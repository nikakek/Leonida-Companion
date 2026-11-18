"use client";

import { useRef } from "react";
import { regions } from "@/config/regions";
import { pins } from "@/data/pins";

interface MapProgressProps {
  found: ReadonlySet<string>;
  onReset: () => void;
}

export function MapProgress({ found, onReset }: MapProgressProps) {
  const confirmRef = useRef<HTMLDialogElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const total = pins.length;
  const foundCount = pins.filter((pin) => found.has(pin.id)).length;
  const percent = total === 0 ? 0 : Math.round((foundCount / total) * 100);

  const closeConfirm = () => confirmRef.current?.close();

  return (
    <section aria-labelledby="progress-title" className="panel p-4 md:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 id="progress-title" ref={headingRef} tabIndex={-1} className="eyebrow text-muted">
          Progress
        </h2>
        <p className="font-mono text-[12px] text-faint">{percent}%</p>
      </div>
      <p className="display mt-2 text-[52px] leading-none">
        {foundCount}
        <span className="text-faint"> / {total}</span>
        <span className="ml-2 align-middle font-mono text-[11px] tracking-[0.12em] text-muted">FOUND</span>
      </p>
      {/* One segment per pin, grouped by region and lit in the region color once found. */}
      <div
        className="mt-3 flex gap-[3px]"
        role="progressbar"
        aria-label="Pins found"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={foundCount}
        aria-valuetext={`${foundCount} of ${total} found`}
      >
        {regions.flatMap((region) =>
          pins
            .filter((pin) => pin.region === region.id)
            .map((pin) => (
              <span
                key={pin.id}
                className="h-2.5 flex-1 rounded-[2px] transition-colors duration-150"
                style={{
                  backgroundColor: found.has(pin.id) ? region.color : "#1E1E2B",
                  boxShadow: found.has(pin.id) ? `0 0 8px -1px ${region.color}` : undefined,
                }}
              />
            )),
        )}
      </div>

      <ul className="mt-5 flex flex-col gap-2.5 border-t border-line pt-4">
        {regions.map((region) => {
          const regionPins = pins.filter((pin) => pin.region === region.id);
          const regionFound = regionPins.filter((pin) => found.has(pin.id)).length;
          const regionPercent = regionPins.length === 0 ? 0 : (regionFound / regionPins.length) * 100;
          return (
            <li key={region.id} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 text-[14px]">
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: region.color }} />
                {region.name}
              </span>
              <span className="font-mono text-[13px] text-muted">
                {regionFound}/{regionPins.length}
              </span>
              <span aria-hidden="true" className="col-span-2 h-1 overflow-hidden rounded-full bg-[#1E1E2B]">
                <span
                  className="block h-full rounded-full transition-[width] duration-150"
                  style={{ width: `${regionPercent}%`, backgroundColor: region.color }}
                />
              </span>
            </li>
          );
        })}
      </ul>

      <button
        ref={resetButtonRef}
        type="button"
        className="btn-secondary btn-sm mt-5"
        disabled={foundCount === 0}
        onClick={() => confirmRef.current?.showModal()}
      >
        Reset Progress
      </button>

      <dialog
        ref={confirmRef}
        aria-labelledby="reset-title"
        aria-describedby="reset-description"
        className="dialog-sheet dialog-modal"
        onClose={() => {
          // After a reset the button is disabled and cannot take focus, so fall back to the heading.
          const button = resetButtonRef.current;
          if (button && !button.disabled) button.focus();
          else headingRef.current?.focus();
        }}
      >
        <div className="flex flex-col gap-4 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] md:p-7">
          <p className="eyebrow text-danger">Destructive</p>
          <h2 id="reset-title" className="section-title -mt-2">
            Reset Progress?
          </h2>
          <p id="reset-description" className="text-muted">
            This clears all {foundCount} found pins on this device. It cannot be undone.
          </p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" className="btn-secondary" onClick={closeConfirm} autoFocus>
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                onReset();
                closeConfirm();
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
