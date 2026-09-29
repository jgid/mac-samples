// Virtual screen resolutions, device presets and viewport geometry (work package A).
import type { Preset, Resolution, ScaleMode, ViewportGeometry } from '../types';

export const MIN_WIDTH = 320;
export const MAX_WIDTH = 7680;
export const MIN_HEIGHT = 240;
export const MAX_HEIGHT = 4320;

/** In 'fill' mode the virtual height may grow up to this multiple of the chosen height. */
export const FILL_MAX_HEIGHT_FACTOR = 2;

export const DEFAULT_RESOLUTION: Resolution = { width: 1920, height: 1080 };

/** Device-named presets, ordered small → large. */
export const PRESETS: Preset[] = [
  { id: 'laptop-small', label: 'Kleiner Laptop', detail: 'Ältere oder kompakte Notebooks', group: 'laptop', width: 1280, height: 800 },
  { id: 'laptop-hd', label: 'Laptop HD (Windows)', detail: 'Günstige Windows-Notebooks, sehr verbreitet', group: 'laptop', width: 1366, height: 768 },
  { id: 'macbook-air-1440', label: 'MacBook Air 13″ (bis 2020)', detail: 'Ältere Mac-Laptops, sehr verbreitet', group: 'laptop', width: 1440, height: 900 },
  { id: 'macbook-air-13', label: 'MacBook Air 13″', detail: 'Typischer Mac-Laptop (Standard-Skalierung)', group: 'laptop', width: 1470, height: 956 },
  { id: 'macbook-pro-14', label: 'MacBook Pro 14″', detail: 'Mac-Laptop für Profis', group: 'laptop', width: 1512, height: 982 },
  { id: 'laptop-15-win', label: 'Laptop 15″ Windows 125 %', detail: 'Full-HD-Notebook mit 125 % Skalierung', group: 'laptop', width: 1536, height: 864 },
  { id: 'macbook-pro-16', label: 'MacBook Pro 16″', detail: 'Großer Mac-Laptop', group: 'laptop', width: 1728, height: 1117 },
  { id: 'monitor-fullhd', label: 'Full-HD-Monitor', detail: 'Häufigste Desktop-Auflösung', group: 'desktop', width: 1920, height: 1080 },
  { id: 'imac-24', label: 'iMac 24″', detail: 'All-in-one-Mac (Standard-Skalierung)', group: 'desktop', width: 2240, height: 1260 },
  { id: 'imac-27', label: 'iMac 27″ / WQHD-Monitor', detail: 'Großer iMac oder 27″-Monitor bei 100 %', group: 'desktop', width: 2560, height: 1440 },
  { id: 'studio-display-more', label: 'Studio Display 27″ (mehr Platz)', detail: '5K-Display mit maximaler Arbeitsfläche', group: 'large', width: 3200, height: 1800 },
  { id: 'ultrawide', label: 'Ultrawide-Monitor', detail: '34″ im 21:9-Format', group: 'large', width: 3440, height: 1440 },
  { id: 'monitor-4k', label: '4K-Monitor (100 %)', detail: 'Riesige Arbeitsfläche ohne Skalierung', group: 'large', width: 3840, height: 2160 },
];

export const PRESET_GROUP_LABELS: Record<Preset['group'], string> = {
  laptop: 'Laptops',
  desktop: 'Monitore',
  large: 'Große Bildschirme',
};

function clampNumber(v: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(v)) return fallback;
  return Math.min(max, Math.max(min, Math.round(v)));
}

export function clampResolution(r: Resolution): Resolution {
  return {
    width: clampNumber(r?.width, MIN_WIDTH, MAX_WIDTH, DEFAULT_RESOLUTION.width),
    height: clampNumber(r?.height, MIN_HEIGHT, MAX_HEIGHT, DEFAULT_RESOLUTION.height),
  };
}

export function findPreset(r: Resolution): Preset | undefined {
  return PRESETS.find((p) => p.width === r.width && p.height === r.height);
}

/**
 * Fits the virtual screen into a container of containerWidth × containerHeight phone points.
 * fill:  scale = containerWidth / r.width, cssHeight = round(containerHeight / scale), offsets 0.
 * exact: scale = min(cw / r.width, ch / r.height), cssHeight = r.height, centered offsets.
 */
export function computeGeometry(
  containerWidth: number,
  containerHeight: number,
  r: Resolution,
  mode: ScaleMode,
): ViewportGeometry {
  const res = clampResolution(r);
  const cw = Number.isFinite(containerWidth) && containerWidth > 0 ? containerWidth : 0;
  const ch = Number.isFinite(containerHeight) && containerHeight > 0 ? containerHeight : 0;
  if (cw === 0 || ch === 0) {
    // Container not laid out yet: return a safe, finite geometry.
    return { cssWidth: res.width, cssHeight: res.height, scale: 1, offsetX: 0, offsetY: 0 };
  }
  if (mode === 'exact') {
    const scale = Math.min(cw / res.width, ch / res.height);
    return {
      cssWidth: res.width,
      cssHeight: res.height,
      scale,
      offsetX: (cw - res.width * scale) / 2,
      offsetY: (ch - res.height * scale) / 2,
    };
  }
  const scale = cw / res.width;
  // Cap the stretched height: a portrait phone would otherwise ask WebKit to render
  // e.g. 1920 × 4000 CSS px, which costs a lot of memory for little benefit.
  const maxHeight = res.height * FILL_MAX_HEIGHT_FACTOR;
  return {
    cssWidth: res.width,
    cssHeight: Math.max(1, Math.min(maxHeight, Math.round(ch / scale))),
    scale,
    offsetX: 0,
    offsetY: 0,
  };
}

/** "1920 × 1080" */
export function formatResolution(r: Resolution): string {
  return `${Math.round(r.width)} × ${Math.round(r.height)}`;
}

/** "21 %" */
export function formatScale(scale: number): string {
  if (!Number.isFinite(scale)) return '– %';
  return `${Math.round(scale * 100)} %`;
}
