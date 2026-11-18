"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { LeonidaMap } from "@/components/map/LeonidaMap";
import { MapProgress } from "@/components/map/MapProgress";
import { PinDrawer } from "@/components/map/PinDrawer";
import { PinGlyph } from "@/components/map/PinGlyph";
import { FULL_VIEW, regionFocus, type ViewBox } from "@/components/map/geometry";
import { getRegion, regions, type RegionId } from "@/config/regions";
import { getPinCategory, pinCategories, pins, type Pin, type PinCategoryId } from "@/data/pins";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/events";

const noneFound: string[] = [];
const ANIMATION_MS = 450;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Animates the SVG viewBox in state with requestAnimationFrame (viewBox cannot be CSS-transitioned reliably). */
function useAnimatedViewBox() {
  const [viewBox, setViewBox] = useState<ViewBox>(FULL_VIEW);
  const current = useRef<ViewBox>(FULL_VIEW);
  const frame = useRef<number | null>(null);

  const animateTo = useCallback((target: ViewBox) => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    const from = current.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      current.current = target;
      setViewBox(target);
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ANIMATION_MS);
      const e = easeInOutCubic(t);
      const next = from.map((value, i) => value + (target[i] - value) * e) as ViewBox;
      current.current = next;
      setViewBox(next);
      frame.current = t < 1 ? requestAnimationFrame(step) : null;
    };
    frame.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);

  return [viewBox, animateTo] as const;
}

export function MapExplorer() {
  const [viewBox, animateTo] = useAnimatedViewBox();
  const [region, setRegion] = useState<RegionId | null>(null);
  const [category, setCategory] = useState<PinCategoryId | null>(null);
  const [activePin, setActivePin] = useState<Pin | null>(null);
  const [storedFound, setFound] = useLocalStorage<string[]>(STORAGE_KEYS.foundPins, noneFound);
  const found = useMemo(() => new Set(Array.isArray(storedFound) ? storedFound : []), [storedFound]);

  const selectRegion = (next: RegionId | null) => {
    setRegion(next);
    animateTo(next ? regionFocus[next] : FULL_VIEW);
  };

  const toggleFound = (pin: Pin) =>
    setFound((previous) => {
      const list = Array.isArray(previous) ? previous : [];
      return list.includes(pin.id) ? list.filter((id) => id !== pin.id) : [...list, pin.id];
    });

  const closeDrawer = useCallback(() => setActivePin(null), []);

  const mapPins = pins.filter((pin) => !category || pin.category === category);
  const listPins = mapPins.filter((pin) => !region || pin.region === region);

  return (
    <>
      <div className="mb-5 flex flex-col gap-3">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Zoom to region">
          <button type="button" className="chip" aria-pressed={region === null} onClick={() => selectRegion(null)}>
            All Leonida
          </button>
          {regions.map((item) => (
            <button
              key={item.id}
              type="button"
              className="chip gap-2"
              aria-pressed={region === item.id}
              onClick={() => selectRegion(region === item.id ? null : item.id)}
            >
              <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </button>
          ))}
        </div>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filter by category">
          <button type="button" className="chip" aria-pressed={category === null} onClick={() => setCategory(null)}>
            All Pins
          </button>
          {pinCategories.map((item) => (
            <button
              key={item.id}
              type="button"
              className="chip gap-2"
              aria-pressed={category === item.id}
              onClick={() => setCategory(category === item.id ? null : item.id)}
            >
              <PinGlyph category={item.id} color={item.color} />
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,auto)_minmax(340px,1fr)] lg:items-start xl:gap-8">
        <div className="mx-auto w-full min-w-0 max-w-[calc((100svh-9rem)*0.8)] lg:w-[min(62vw,calc((100svh-9rem)*0.8))] lg:max-w-none">
          <div className="hud-frame -mx-4 overflow-hidden border-y border-line md:mx-0 md:rounded-card md:border">
            <LeonidaMap
              viewBox={viewBox}
              pins={mapPins}
              found={found}
              selectedRegion={region}
              activePinId={activePin?.id ?? null}
              onSelectPin={setActivePin}
              onSelectRegion={(id) => selectRegion(region === id ? null : id)}
            />
            <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-0.5 font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
              <span className="text-fg">State of Leonida</span>
              <span>{region ? getRegion(region).name : "All regions"}</span>
            </div>
            <svg aria-hidden="true" width="34" height="34" viewBox="0 0 34 34" className="pointer-events-none absolute top-3 right-3 text-muted">
              <circle cx="17" cy="17" r="15" fill="rgba(8,8,13,0.6)" stroke="currentColor" strokeOpacity="0.4" />
              <path d="M17 5 20 17h-6z" fill="#FF4D9D" />
              <path d="M17 29 14 17h6z" fill="currentColor" fillOpacity="0.5" />
            </svg>
            {region ? (
              <button
                type="button"
                onClick={() => selectRegion(null)}
                className="absolute right-3 bottom-3 inline-flex min-h-10 items-center gap-1.5 rounded-md border border-line-strong bg-bg/85 px-3 font-mono text-[11px] tracking-[0.1em] text-fg uppercase backdrop-blur-sm transition-colors duration-150 hover:border-accent"
              >
                Show all
              </button>
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <ul className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Legend">
              {pinCategories.map((item) => (
                <li key={item.id} className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.06em] text-muted uppercase">
                  <PinGlyph category={item.id} color={item.color} size={14} />
                  {item.name}
                </li>
              ))}
            </ul>
            <p className="font-mono text-[11px] text-faint">Stylized, not to scale. Pins are samples.</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <MapProgress found={found} onReset={() => setFound([])} />

          <section aria-labelledby="pin-list-title">
            <h2 id="pin-list-title" className="eyebrow mb-3 flex justify-between text-muted">
              <span>{region ? `Pins in ${getRegion(region).name}` : "All pins"}</span>
              <span className="text-faint">{listPins.length}</span>
            </h2>
            {listPins.length === 0 ? (
              <p className="rounded-card border border-dashed border-line-strong p-5 text-muted">No pins match these filters.</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {listPins.map((pin) => {
                  const pinCategory = getPinCategory(pin.category);
                  const isFound = found.has(pin.id);
                  return (
                    <li key={pin.id}>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.currentTarget.focus();
                          setActivePin(pin);
                        }}
                        className={`stripe-row flex min-h-14 w-full items-center gap-3 px-3.5 py-2 pl-4 text-left ${
                          activePin?.id === pin.id ? "border-accent/60" : ""
                        }`}
                        style={{ "--stripe": getRegion(pin.region).color } as CSSProperties}
                      >
                        <PinGlyph category={pin.category} color={pinCategory.color} size={20} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{pin.title}</span>
                          <span className="block font-mono text-[11px] tracking-[0.06em] text-muted uppercase">
                            {pinCategory.name} · {getRegion(pin.region).name}
                          </span>
                        </span>
                        <span
                          className={`shrink-0 rounded-[4px] border px-1.5 py-0.5 font-mono text-[10px] tracking-[0.1em] uppercase ${
                            isFound ? "border-ok/40 text-ok" : "border-line text-faint"
                          }`}
                        >
                          {isFound ? "Found" : "Open"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>

      <PinDrawer
        pin={activePin}
        found={activePin ? found.has(activePin.id) : false}
        onToggleFound={toggleFound}
        onClose={closeDrawer}
      />
    </>
  );
}
