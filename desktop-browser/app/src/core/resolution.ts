// STUB – implemented by work package A. Signatures are the contract.
import type { Preset, Resolution, ScaleMode, ViewportGeometry } from '../types';

export const MIN_WIDTH = 320;
export const MAX_WIDTH = 7680;
export const MIN_HEIGHT = 240;
export const MAX_HEIGHT = 4320;

export const DEFAULT_RESOLUTION: Resolution = { width: 1920, height: 1080 };

/** Device-named presets, ordered small → large. */
export const PRESETS: Preset[] = [];

export const PRESET_GROUP_LABELS: Record<Preset['group'], string> = {
  laptop: 'Laptops',
  desktop: 'Monitore',
  large: 'Große Bildschirme',
};

export function clampResolution(r: Resolution): Resolution {
  throw new Error('not implemented');
}

export function findPreset(r: Resolution): Preset | undefined {
  throw new Error('not implemented');
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
  throw new Error('not implemented');
}

/** "1920 × 1080" */
export function formatResolution(r: Resolution): string {
  throw new Error('not implemented');
}

/** "21 %" */
export function formatScale(scale: number): string {
  throw new Error('not implemented');
}
