"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { CloseIcon } from "@/components/Icons";
import { StatusBadge } from "@/components/StatusBadge";
import { PinGlyph } from "@/components/map/PinGlyph";
import { getRegion } from "@/config/regions";
import { getPinCategory, type Pin } from "@/data/pins";
import { formatDate } from "@/lib/format";

interface PinDrawerProps {
  pin: Pin | null;
  found: boolean;
  onToggleFound: (pin: Pin) => void;
  onClose: () => void;
}

const CLOSE_DISTANCE = 100;

/** Pin details: bottom sheet on mobile (swipe down to close), right-side panel on desktop. */
export function PinDrawer({ pin, found, onToggleFound, onClose }: PinDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const restoreFocusRef = useRef<HTMLElement | SVGElement | null>(null);
  const drag = useRef<{ startY: number; dy: number } | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (pin && !dialog.open) {
      const active = document.activeElement;
      restoreFocusRef.current = active instanceof HTMLElement || active instanceof SVGElement ? active : null;
      dialog.style.transform = "";
      dialog.showModal();
    } else if (!pin && dialog.open) {
      dialog.close();
    }
  }, [pin]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      dialog.style.transform = "";
      dialog.style.transition = "";
      onClose();
      restoreFocusRef.current?.focus();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(min-width: 48rem)").matches) return;
    drag.current = { startY: event.clientY, dy: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
    if (dialogRef.current) dialogRef.current.style.transition = "none";
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    const dialog = dialogRef.current;
    if (!state || !dialog) return;
    state.dy = Math.max(0, event.clientY - state.startY);
    dialog.style.transform = `translateY(${state.dy}px)`;
  };

  const onPointerEnd = () => {
    const state = drag.current;
    const dialog = dialogRef.current;
    drag.current = null;
    if (!state || !dialog) return;
    if (state.dy > CLOSE_DISTANCE) {
      dialog.close();
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    dialog.style.transition = reduce ? "none" : "transform 150ms ease-out";
    dialog.style.transform = "";
  };

  const category = pin ? getPinCategory(pin.category) : null;
  const region = pin ? getRegion(pin.region) : null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="pin-drawer-title"
      className="dialog-sheet dialog-panel"
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
    >
      {pin && category && region ? (
        <div className="flex min-h-full flex-col">
          <div
            className="flex cursor-grab touch-none justify-center pt-3 pb-2 md:hidden"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            aria-hidden="true"
          >
            <span className="sheet-handle" />
          </div>
          <span aria-hidden="true" className="mx-5 h-[2px] rounded-full md:mx-0" style={{ backgroundColor: region.color }} />
          <div className="flex flex-col gap-5 p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:p-7">
            <div className="flex items-start gap-3.5">
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-md border"
                style={{ borderColor: `${category.color}66`, backgroundColor: `${category.color}14` }}
              >
                <PinGlyph category={pin.category} color={category.color} size={24} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[11px] tracking-[0.12em] uppercase" style={{ color: category.color }}>
                  {category.name}
                </p>
                <h2 id="pin-drawer-title" className="display mt-1 text-[32px] leading-[0.95]">
                  {pin.title}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => dialogRef.current?.close()}
                className="icon-btn -mt-1 -mr-1"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            <dl className="grid grid-cols-2 overflow-hidden rounded-md border border-line text-[14px]">
              <div className="border-r border-line p-3">
                <dt className="font-mono text-[10px] tracking-[0.14em] text-faint uppercase">Region</dt>
                <dd className="mt-1 flex items-center gap-2 font-medium">
                  <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: region.color }} />
                  {region.name}
                </dd>
              </div>
              <div className="p-3">
                <dt className="font-mono text-[10px] tracking-[0.14em] text-faint uppercase">Status</dt>
                <dd className="mt-1.5">
                  <StatusBadge status={pin.status} />
                </dd>
              </div>
            </dl>

            {pin.status !== "confirmed" ? (
              <p className="rounded-md border border-dashed border-sample/50 px-3.5 py-3 text-[14px] text-sample">
                Sample pin: location unverified at launch.
              </p>
            ) : null}

            <p className="text-[15px] text-muted">{pin.description}</p>

            <label
              className={`flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-md border px-4 py-3 font-semibold transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                found ? "border-ok/50 bg-ok/10" : "border-line-strong bg-[#0b0b12]"
              }`}
            >
              <span>{found ? "Found" : "Mark as Found"}</span>
              <input type="checkbox" checked={found} onChange={() => onToggleFound(pin)} className="peer sr-only" />
              <span
                aria-hidden="true"
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150 ${found ? "bg-ok" : "bg-line-strong"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-fg transition-transform duration-150 ${found ? "translate-x-5" : ""}`}
                />
              </span>
            </label>

            <p className="meta">Last checked {formatDate(pin.lastVerified)}</p>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
