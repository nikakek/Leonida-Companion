"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Zoom to region">
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
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filter by category">
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
              <PinGlyph category={item.id} color={category === item.id ? "#0B0A1C" : item.color} />
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div>
          <LeonidaMap
            viewBox={viewBox}
            pins={mapPins}
            found={found}
            selectedRegion={region}
            onSelectPin={setActivePin}
            onSelectRegion={(id) => selectRegion(region === id ? null : id)}
          />
          <p className="mt-3 text-[14px] text-muted">Stylized, not to scale. All pins are samples until verified.</p>
        </div>

        <div className="flex flex-col gap-6">
          <MapProgress found={found} onReset={() => setFound([])} />

          <section aria-labelledby="pin-list-title">
            <h2 id="pin-list-title" className="card-title mb-3">
              {region ? `Pins in ${getRegion(region).name}` : "All Pins"}{" "}
              <span className="text-muted">({listPins.length})</span>
            </h2>
            {listPins.length === 0 ? (
              <p className="rounded-2xl bg-card p-5 text-muted">No pins match these filters.</p>
            ) : (
              <ul className="flex flex-col gap-2">
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
                        className="flex min-h-14 w-full items-center gap-3 rounded-2xl bg-card px-4 py-2 text-left transition-colors duration-150 hover:bg-card-hover"
                      >
                        <PinGlyph category={pin.category} color={pinCategory.color} size={20} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{pin.title}</span>
                          <span className="block text-[14px] text-muted">
                            {pinCategory.name} · {getRegion(pin.region).name}
                          </span>
                        </span>
                        <span className={`font-mono text-[12px] ${isFound ? "text-ok" : "text-muted"}`}>
                          {isFound ? "Found" : "Not found"}
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
