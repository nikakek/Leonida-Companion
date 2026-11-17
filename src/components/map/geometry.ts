import type { RegionId } from "@/config/regions";

/**
 * Stylized, not-to-scale shapes for the State of Leonida in a 0 0 800 1000 viewBox.
 * Simple polygons: a panhandle across the top and a peninsula running south, with a key chain.
 */

export const MAP_WIDTH = 800;
export const MAP_HEIGHT = 1000;

export type ViewBox = [x: number, y: number, w: number, h: number];
export const FULL_VIEW: ViewBox = [0, 0, MAP_WIDTH, MAP_HEIGHT];

type Point = [number, number];

const polygons: Record<Exclude<RegionId, "leonida-keys">, Point[]> = {
  "port-gellhorn": [[40, 110], [230, 95], [250, 150], [245, 235], [150, 215], [60, 190], [30, 150]],
  ambrosia: [[230, 95], [470, 80], [480, 170], [470, 260], [380, 270], [245, 235], [250, 150]],
  "mount-kalaga": [[470, 80], [690, 95], [720, 190], [700, 320], [560, 340], [470, 260], [480, 170]],
  grassrivers: [[380, 270], [470, 260], [560, 340], [590, 470], [580, 640], [520, 760], [450, 700], [420, 560], [390, 420]],
  "vice-city": [[560, 340], [700, 320], [725, 470], [705, 620], [650, 750], [520, 760], [580, 640], [590, 470]],
};

/** Islands along an arc for the Keys, as rotated ellipses approximated by polygons. */
function keyIslands(): Point[][] {
  const islands: [cx: number, cy: number, rx: number][] = [
    [604, 802, 20], [562, 834, 24], [515, 860, 20], [466, 880, 22], [415, 895, 24], [364, 905, 18], [322, 912, 14],
  ];
  return islands.map(([cx, cy, rx], index) => {
    const next = islands[Math.min(index + 1, islands.length - 1)];
    const previous = islands[Math.max(index - 1, 0)];
    const angle = Math.atan2(next[1] - previous[1], next[0] - previous[0]);
    const ry = 7;
    return Array.from({ length: 12 }, (_, step): Point => {
      const t = (step / 12) * Math.PI * 2;
      const x = Math.cos(t) * rx;
      const y = Math.sin(t) * ry;
      return [
        Math.round((cx + x * Math.cos(angle) - y * Math.sin(angle)) * 10) / 10,
        Math.round((cy + x * Math.sin(angle) + y * Math.cos(angle)) * 10) / 10,
      ];
    });
  });
}

const shapes: Record<RegionId, Point[][]> = {
  "port-gellhorn": [polygons["port-gellhorn"]],
  ambrosia: [polygons.ambrosia],
  "mount-kalaga": [polygons["mount-kalaga"]],
  grassrivers: [polygons.grassrivers],
  "vice-city": [polygons["vice-city"]],
  "leonida-keys": keyIslands(),
};

const toPath = (rings: Point[][]) => rings.map((ring) => `M${ring.map(([x, y]) => `${x} ${y}`).join("L")}Z`).join("");

export const regionPaths: Record<RegionId, string> = Object.fromEntries(
  Object.entries(shapes).map(([id, rings]) => [id, toPath(rings)]),
) as Record<RegionId, string>;

export const regionLabels: Record<RegionId, Point> = {
  "port-gellhorn": [140, 140],
  ambrosia: [360, 132],
  "mount-kalaga": [598, 148],
  grassrivers: [488, 520],
  "vice-city": [650, 540],
  "leonida-keys": [470, 962],
};

/** Zoom target: region bounds plus padding, widened to the map's 4:5 aspect ratio. */
function focusFor(rings: Point[][]): ViewBox {
  const xs = rings.flat().map(([x]) => x);
  const ys = rings.flat().map(([, y]) => y);
  const pad = 50;
  let minX = Math.min(...xs) - pad;
  let minY = Math.min(...ys) - pad;
  let w = Math.max(...xs) + pad - minX;
  let h = Math.max(...ys) + pad - minY;
  const ratio = MAP_WIDTH / MAP_HEIGHT;
  if (w / h > ratio) {
    const newH = w / ratio;
    minY -= (newH - h) / 2;
    h = newH;
  } else {
    const newW = h * ratio;
    minX -= (newW - w) / 2;
    w = newW;
  }
  return [minX, minY, w, h];
}

export const regionFocus: Record<RegionId, ViewBox> = Object.fromEntries(
  Object.entries(shapes).map(([id, rings]) => [id, focusFor(rings)]),
) as Record<RegionId, ViewBox>;
