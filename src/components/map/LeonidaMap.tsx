"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { getRegion, regions, type RegionId } from "@/config/regions";
import { getPinCategory, type Pin } from "@/data/pins";
import { MAP_WIDTH, regionLabels, regionPaths, type ViewBox } from "@/components/map/geometry";
import { pinShapePaths } from "@/components/map/PinGlyph";

interface LeonidaMapProps {
  viewBox: ViewBox;
  pins: Pin[];
  found: ReadonlySet<string>;
  selectedRegion: RegionId | null;
  /** Pin whose details are open; drawn with a highlight so it is recognizable on the map. */
  activePinId: string | null;
  onSelectPin: (pin: Pin) => void;
  onSelectRegion: (region: RegionId) => void;
}

const GRID = Array.from({ length: 29 }, (_, i) => -200 + i * 50);
const allLand = regions.map((region) => regionPaths[region.id]).join("");

export function LeonidaMap({ viewBox, pins, found, selectedRegion, activePinId, onSelectPin, onSelectRegion }: LeonidaMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  // Rendered width in CSS px; a sensible guess until measured.
  const [pxWidth, setPxWidth] = useState(560);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setPxWidth(entry.contentRect.width);
    });
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  // Map units per screen pixel: pins and labels are scaled by this so they stay the same size while zoomed.
  const k = viewBox[2] / pxWidth;
  const zoomed = viewBox[2] < MAP_WIDTH - 1;

  const onPinKey = (event: KeyboardEvent<SVGGElement>, pin: Pin) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectPin(pin);
    }
  };

  const onPinClick = (event: MouseEvent<SVGGElement>, pin: Pin) => {
    // Focus first so the drawer restores focus here on close (Safari does not focus on click).
    event.currentTarget.focus();
    onSelectPin(pin);
  };

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox.map((n) => n.toFixed(2)).join(" ")}
      preserveAspectRatio="xMidYMid meet"
      className="block aspect-[4/5] w-full touch-manipulation bg-[#070b16] select-none"
      role="group"
      aria-label={`Stylized map of Leonida${selectedRegion ? `, zoomed to ${getRegion(selectedRegion).name}` : ""}`}
    >
      <defs>
        <radialGradient id="leonida-water" cx="62%" cy="45%" r="75%">
          <stop offset="0" stopColor="#0F1A33" />
          <stop offset="1" stopColor="#060810" />
        </radialGradient>
      </defs>
      <rect x="-400" y="-400" width="1600" height="1800" fill="url(#leonida-water)" />

      <g aria-hidden="true">
        {GRID.map((n) => (
          <g key={n}>
            <line x1={n} y1="-400" x2={n} y2="1400" stroke="#3DE3F0" strokeOpacity={n % 200 === 0 ? 0.07 : 0.03} vectorEffect="non-scaling-stroke" />
            <line x1="-400" y1={n} x2="1200" y2={n} stroke="#3DE3F0" strokeOpacity={n % 200 === 0 ? 0.07 : 0.03} vectorEffect="non-scaling-stroke" />
          </g>
        ))}
      </g>

      <g aria-hidden="true">
        {/* Shallow-water shelf: a wide, faint cyan stroke under the coastline. */}
        <path d={allLand} fill="none" stroke="#3DE3F0" strokeOpacity="0.08" strokeWidth="14" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        <path d={allLand} fill="none" stroke="#3DE3F0" strokeOpacity="0.14" strokeWidth="5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {regions.map((region) => {
          const active = selectedRegion === region.id;
          const dimmed = selectedRegion !== null && !active;
          return (
            <g key={region.id} onClick={() => onSelectRegion(region.id)} className="cursor-pointer">
              <path d={regionPaths[region.id]} fill="#141420" />
              <path
                d={regionPaths[region.id]}
                fill={region.color}
                fillOpacity={active ? 0.26 : dimmed ? 0.06 : 0.15}
                stroke={region.color}
                strokeOpacity={dimmed ? 0.45 : 1}
                strokeWidth={active ? 2.5 : 1.5}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        })}
        {regions.map((region) => {
          const [x, y] = regionLabels[region.id];
          const dimmed = selectedRegion !== null && selectedRegion !== region.id;
          return (
            <text
              key={region.id}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize={(zoomed ? 20 : 17) * k}
              letterSpacing={0.6 * k}
              fontFamily="var(--font-bebas-neue), 'Arial Narrow', sans-serif"
              fill="#F4F2F8"
              fillOpacity={dimmed ? 0.45 : 1}
              stroke="#08080D"
              strokeWidth={3.5 * k}
              strokeLinejoin="round"
              paintOrder="stroke"
              pointerEvents="none"
              style={{ textTransform: "uppercase" }}
            >
              {region.name}
            </text>
          );
        })}
      </g>

      <g>
        {pins.map((pin) => {
          const category = getPinCategory(pin.category);
          const isFound = found.has(pin.id);
          const isActive = pin.id === activePinId;
          return (
            <g
              key={pin.id}
              className="map-pin"
              transform={`translate(${pin.x} ${pin.y}) scale(${k})`}
              role="button"
              tabIndex={0}
              aria-label={`${pin.title}, ${category.name}, ${getRegion(pin.region).name}${isFound ? ", found" : ""}`}
              aria-pressed={isActive}
              onClick={(event) => onPinClick(event, pin)}
              onKeyDown={(event) => onPinKey(event, pin)}
            >
              {/* Invisible 44px hit target */}
              <circle r="22" fill="transparent" />
              {isActive ? (
                <>
                  <circle r="24" fill={category.color} fillOpacity="0.18" />
                  <circle r="19" fill="none" stroke="#FFFFFF" strokeWidth="2" />
                </>
              ) : null}
              <circle className="pin-ring" r="19" fill="none" strokeWidth="3" />
              <circle r="14" fill={isFound ? category.color : "#08080D"} stroke={category.color} strokeWidth="2" />
              <path d={pinShapePaths[pin.category]} fill={isFound ? "#08080D" : category.color} transform="scale(0.85)" />
              {isFound ? (
                <g transform="translate(10 -10)">
                  <circle r="6" fill="#3DDC84" stroke="#08080D" strokeWidth="1.5" />
                  <path d="m-2.5 0 1.8 1.8 3.2-3.4" fill="none" stroke="#08080D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              ) : null}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
