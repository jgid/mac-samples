import {
  clampResolution,
  computeGeometry,
  DEFAULT_RESOLUTION,
  findPreset,
  formatResolution,
  formatScale,
  MAX_HEIGHT,
  MAX_WIDTH,
  MIN_HEIGHT,
  MIN_WIDTH,
  PRESET_GROUP_LABELS,
  PRESETS,
} from '../../src/core/resolution';

describe('PRESETS', () => {
  it('has unique ids and unique sizes', () => {
    expect(new Set(PRESETS.map((p) => p.id)).size).toBe(PRESETS.length);
    expect(new Set(PRESETS.map((p) => `${p.width}x${p.height}`)).size).toBe(PRESETS.length);
  });
  it('is sorted small → large and grouped in order', () => {
    for (let i = 1; i < PRESETS.length; i++) {
      expect(PRESETS[i].width).toBeGreaterThan(PRESETS[i - 1].width);
    }
    const order = ['laptop', 'desktop', 'large'];
    const groups = PRESETS.map((p) => order.indexOf(p.group));
    expect([...groups].sort((a, b) => a - b)).toEqual(groups);
    expect(groups.every((g) => g >= 0)).toBe(true);
  });
  it('has labels, details and valid sizes', () => {
    for (const p of PRESETS) {
      expect(p.label).toBeTruthy();
      expect(p.detail).toBeTruthy();
      expect(PRESET_GROUP_LABELS[p.group]).toBeTruthy();
      expect(clampResolution(p)).toEqual({ width: p.width, height: p.height });
    }
  });
  it('contains the common sizes', () => {
    expect(findPreset({ width: 1920, height: 1080 })?.label).toBe('Full-HD-Monitor');
    expect(findPreset({ width: 1470, height: 956 })?.label).toContain('MacBook Air');
    expect(findPreset({ width: 1366, height: 768 })).toBeDefined();
    expect(findPreset({ width: 1234, height: 567 })).toBeUndefined();
    expect(findPreset(DEFAULT_RESOLUTION)).toBeDefined();
  });
});

describe('clampResolution', () => {
  it('clamps and rounds', () => {
    expect(clampResolution({ width: 100, height: 100 })).toEqual({ width: MIN_WIDTH, height: MIN_HEIGHT });
    expect(clampResolution({ width: 99999, height: 99999 })).toEqual({ width: MAX_WIDTH, height: MAX_HEIGHT });
    expect(clampResolution({ width: 1280.6, height: 800.4 })).toEqual({ width: 1281, height: 800 });
  });
  it('falls back for non-finite values', () => {
    expect(clampResolution({ width: NaN, height: Infinity })).toEqual(DEFAULT_RESOLUTION);
  });
});

describe('computeGeometry', () => {
  const r = { width: 1920, height: 1080 };
  it('fill: width fixed, height follows container', () => {
    const g = computeGeometry(844, 700, r, 'fill');
    expect(g.scale).toBeCloseTo(844 / 1920);
    expect(g.cssWidth).toBe(1920);
    expect(g.cssHeight).toBe(Math.round(700 / (844 / 1920)));
    expect(g.offsetX).toBe(0);
    expect(g.offsetY).toBe(0);
  });
  it('fill: stretched height is capped at twice the chosen height', () => {
    expect(computeGeometry(390, 700, r, 'fill').cssHeight).toBe(2160);
  });
  it('exact: letterboxed and centered', () => {
    const g = computeGeometry(390, 700, r, 'exact');
    const scale = Math.min(390 / 1920, 700 / 1080);
    expect(g.scale).toBeCloseTo(scale);
    expect(g.cssWidth).toBe(1920);
    expect(g.cssHeight).toBe(1080);
    expect(g.offsetX).toBeCloseTo(0);
    expect(g.offsetY).toBeCloseTo((700 - 1080 * scale) / 2);
  });
  it('exact: pillarboxed when container is wide', () => {
    const g = computeGeometry(1000, 200, r, 'exact');
    expect(g.scale).toBeCloseTo(200 / 1080);
    expect(g.offsetY).toBeCloseTo(0);
    expect(g.offsetX).toBeCloseTo((1000 - 1920 * (200 / 1080)) / 2);
  });
  it('never returns NaN for empty or invalid containers', () => {
    for (const [w, h] of [[0, 0], [-5, 100], [100, -1], [NaN, 100], [Infinity, 100]]) {
      for (const mode of ['fill', 'exact'] as const) {
        const g = computeGeometry(w, h, r, mode);
        for (const v of Object.values(g)) expect(Number.isFinite(v)).toBe(true);
        expect(g.scale).toBeGreaterThan(0);
        expect(g.cssHeight).toBeGreaterThanOrEqual(1);
      }
    }
  });
  it('fill keeps cssHeight >= 1 for tiny containers', () => {
    expect(computeGeometry(390, 0.01, r, 'fill').cssHeight).toBe(1);
  });
});

describe('format', () => {
  it('formats resolution', () => {
    expect(formatResolution({ width: 1920, height: 1080 })).toBe('1920 × 1080');
  });
  it('formats scale as integer percent', () => {
    expect(formatScale(0.2083)).toBe('21 %');
    expect(formatScale(1)).toBe('100 %');
    expect(formatScale(0.005)).toBe('1 %');
    expect(formatScale(NaN)).not.toContain('NaN');
  });
});
