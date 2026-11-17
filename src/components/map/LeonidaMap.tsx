"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { getRegion, regions, type RegionId } from "@/config/regions";
import { getPinCategory, type Pin } from "@/data/pins";
import { MAP_WIDTH, regionLabels, regionPaths, type ViewBox } from "@/components/map/geometry";
import { pinShapePaths } from "@/components/map/PinGlyph";

interface LeonidaMapProps {
  viewBox: ViewBox;
  pins: Pin[];
  found: ReadonlySet<string>;
  selectedRegion: RegionId | null;
  onSelectPin: (pin: Pin) => void;
  onSelectRegion: (region: RegionId) => void;
}

const GRID = Array.from({ length: 29 }, (_, i) => -200 + i * 50);

export function LeonidaMap({ viewBox, pins, found, selectedRegion, onSelectPin, onSelectRegion }: LeonidaMapProps) {
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

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox.map((n) => n.toFixed(2)).join(" ")}
      preserveAspectRatio="xMidYMid meet"
      className="block aspect-[4/5] w-full touch-manipulation rounded-card bg-[#0E1030] select-none"
      role="group"
      aria-label={`Stylized map of Leonida${selectedRegion ? `, zoomed to ${getRegion(selectedRegion).name}` : ""}`}
    >
      <defs>
        <linearGradient id="leonida-water" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#141A44" />
          <stop offset="1" stopColor="#0B0A1C" />
        </linearGradient>
      </defs>
      <rect x="-400" y="-400" width="1600" height="1800" fill="url(#leonida-water)" />

      <g aria-hidden="true">
        {GRID.map((n) => (
          <g key={n}>
            <line x1={n} y1="-400" x2={n} y2="1400" stroke="#FFFFFF" strokeOpacity={n % 200 === 0 ? 0.06 : 0.03} vectorEffect="non-scaling-stroke" />
            <line x1="-400" y1={n} x2="1200" y2={n} stroke="#FFFFFF" strokeOpacity={n % 200 === 0 ? 0.06 : 0.03} vectorEffect="non-scaling-stroke" />
          </g>
        ))}
      </g>

      <g aria-hidden="true">
        {regions.map((region) => {
          const active = selectedRegion === region.id;
          return (
            <g key={region.id} onClick={() => onSelectRegion(region.id)} className="cursor-pointer">
              <path d={regionPaths[region.id]} fill="#1C1A3A" />
              <path
                d={regionPaths[region.id]}
                fill={region.color}
                fillOpacity={active ? 0.3 : 0.18}
                stroke={region.color}
                strokeWidth={active ? 2.5 : 1.5}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        })}
        {regions.map((region) => {
          const [x, y] = regionLabels[region.id];
          return (
            <text
              key={region.id}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize={(zoomed ? 15 : 13) * k}
              fontWeight={600}
              fontFamily="var(--font-figtree), ui-sans-serif, system-ui, sans-serif"
              fill="#FFFFFF"
              stroke="#0B0A1C"
              strokeWidth={3 * k}
              strokeLinejoin="round"
              paintOrder="stroke"
              pointerEvents="none"
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
          return (
            <g
              key={pin.id}
              className="map-pin"
              transform={`translate(${pin.x} ${pin.y}) scale(${k})`}
              role="button"
              tabIndex={0}
              aria-label={`${pin.title}, ${category.name}, ${getRegion(pin.region).name}${isFound ? ", found" : ""}`}
              onClick={(event) => {
                // Focus first so the drawer restores focus here on close (Safari does not focus on click).
                event.currentTarget.focus();
                onSelectPin(pin);
              }}
              onKeyDown={(event) => onPinKey(event, pin)}
            >
              {/* Invisible 44px hit target */}
              <circle r="22" fill="transparent" />
              <circle className="pin-ring" r="19" fill="none" strokeWidth="3" />
              <circle r="14" fill={isFound ? category.color : "#0B0A1C"} stroke={category.color} strokeWidth="2" />
              <path d={pinShapePaths[pin.category]} fill={isFound ? "#0B0A1C" : category.color} transform="scale(0.85)" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
