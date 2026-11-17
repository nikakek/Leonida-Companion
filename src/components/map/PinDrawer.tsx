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
      className="dialog-sheet dialog-panel backdrop:bg-transparent"
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
    >
      {pin && category && region ? (
        <div className="flex min-h-full flex-col">
          <div
            className="flex cursor-grab touch-none justify-center pt-3 pb-1 md:hidden"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            aria-hidden="true"
          >
            <span className="h-1.5 w-10 rounded-full bg-line-strong" />
          </div>
          <div className="flex flex-col gap-5 p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:p-8">
            <div className="flex items-start justify-between gap-4">
              <h2 id="pin-drawer-title" className="card-title">
                {pin.title}
              </h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => dialogRef.current?.close()}
                className="-mt-2 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:text-fg"
              >
                <CloseIcon size={22} />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px]">
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="size-2.5 rounded-full" style={{ backgroundColor: region.color }} />
                {region.name}
              </span>
              <span className="flex items-center gap-2">
                <PinGlyph category={pin.category} color={category.color} />
                {category.name}
              </span>
              <StatusBadge status={pin.status} />
            </div>

            {pin.status !== "confirmed" ? (
              <p className="rounded-2xl border border-dashed border-sample/60 p-4 text-[15px] text-sample">
                Sample pin: location unverified at launch.
              </p>
            ) : null}

            <p className="text-muted">{pin.description}</p>

            <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl bg-bg px-4 py-3 font-medium">
              <input
                type="checkbox"
                checked={found}
                onChange={() => onToggleFound(pin)}
                className="size-5 shrink-0 accent-[#FF9CCB]"
              />
              Mark as Found
            </label>

            <p className="text-[14px] text-muted">Last checked {formatDate(pin.lastVerified)}</p>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
