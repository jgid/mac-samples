import {
  createDefaultState,
  parsePersistedState,
  reducer,
  serializeState,
} from '../../src/state/reducer';
import type { PersistedState } from '../../src/state/reducer';
import type { Bookmark } from '../../src/types';

const bm = (id: string, url: string, title = url): Bookmark => ({ id, url, title, createdAt: 1 });

describe('defaults', () => {
  it('uses the documented default settings', () => {
    const s = createDefaultState().settings;
    expect(s.resolution).toEqual({ width: 1920, height: 1080 });
    expect(s.scaleMode).toBe('fill');
    expect(s.desktopMode).toBe(true);
    expect(s.searchEngine).toBe('duckduckgo');
    expect(s.homeUrl).toBe('deskview://test');
    expect(s.screenshotInfoBar).toBe(true);
    expect(s.onboardingDone).toBe(false);
  });
});

describe('parsePersistedState', () => {
  it('returns defaults for empty or broken input', () => {
    const d = createDefaultState();
    expect(parsePersistedState(null)).toEqual(d);
    expect(parsePersistedState('')).toEqual(d);
    expect(parsePersistedState('{not json')).toEqual(d);
    expect(parsePersistedState('[1,2]')).toEqual(d);
  });

  it('round-trips a serialized state', () => {
    let s = createDefaultState();
    s = reducer(s, { type: 'updateSettings', patch: { scaleMode: 'exact', onboardingDone: true } });
    s = reducer(s, { type: 'addBookmark', bookmark: bm('a', 'https://example.com', 'Example') });
    s = reducer(s, {
      type: 'setSiteProfile',
      host: 'example.com',
      profile: { host: 'example.com', resolution: { width: 1280, height: 800 }, scaleMode: 'fill' },
    });
    s = reducer(s, { type: 'setHint', hint: 'trackpadHintSeen', value: true });
    expect(parsePersistedState(serializeState(s))).toEqual(s);
  });

  it('fills missing and invalid fields with defaults and clamps resolutions', () => {
    const raw = JSON.stringify({
      settings: {
        resolution: { width: 100000, height: 10 },
        scaleMode: 'weird',
        agentId: 'netscape',
        desktopMode: 'yes',
        searchEngine: 'google',
      },
      bookmarks: [{ url: 'https://a.de', title: 'A' }, { title: 'no url' }, 42],
      siteProfiles: { 'x.de': { resolution: { width: 1, height: 1 }, scaleMode: 'exact' }, bad: 5 },
    });
    const s = parsePersistedState(raw);
    const d = createDefaultState();
    expect(s.settings.resolution.width).toBeLessThanOrEqual(7680);
    expect(s.settings.resolution.height).toBeGreaterThanOrEqual(240);
    expect(s.settings.scaleMode).toBe(d.settings.scaleMode);
    expect(s.settings.agentId).toBe(d.settings.agentId);
    expect(s.settings.desktopMode).toBe(true);
    expect(s.settings.searchEngine).toBe('google');
    expect(s.bookmarks).toHaveLength(1);
    expect(s.bookmarks[0].url).toBe('https://a.de');
    expect(Object.keys(s.siteProfiles)).toEqual(['x.de']);
    expect(s.siteProfiles['x.de'].resolution.width).toBeGreaterThanOrEqual(320);
    expect(s.hints).toEqual(d.hints);
  });
});

describe('reducer', () => {
  let base: PersistedState;
  beforeEach(() => {
    base = createDefaultState();
  });

  it('merges settings patches and clamps resolution', () => {
    const s = reducer(base, { type: 'updateSettings', patch: { resolution: { width: 99999, height: 99999 } } });
    expect(s.settings.resolution).toEqual({ width: 7680, height: 4320 });
    expect(s.settings.scaleMode).toBe(base.settings.scaleMode);
  });

  it('adds bookmarks newest first and de-duplicates by URL', () => {
    let s = reducer(base, { type: 'addBookmark', bookmark: bm('1', 'https://a.de') });
    s = reducer(s, { type: 'addBookmark', bookmark: bm('2', 'https://b.de') });
    s = reducer(s, { type: 'addBookmark', bookmark: bm('3', 'https://a.de', 'A neu') });
    expect(s.bookmarks.map((b) => b.id)).toEqual(['3', '2']);
    expect(s.bookmarks[0].title).toBe('A neu');
  });

  it('removes bookmarks by id', () => {
    let s = reducer(base, { type: 'addBookmark', bookmark: bm('1', 'https://a.de') });
    s = reducer(s, { type: 'removeBookmark', id: '1' });
    expect(s.bookmarks).toEqual([]);
    expect(reducer(s, { type: 'removeBookmark', id: 'missing' })).toBe(s);
  });

  it('sets and removes site profiles', () => {
    const profile = { host: 'shop.de', resolution: { width: 1920, height: 1080 }, scaleMode: 'exact' as const };
    let s = reducer(base, { type: 'setSiteProfile', host: 'shop.de', profile });
    expect(s.siteProfiles['shop.de']).toEqual(profile);
    s = reducer(s, { type: 'setSiteProfile', host: 'shop.de', profile: null });
    expect(s.siteProfiles).toEqual({});
    expect(reducer(s, { type: 'setSiteProfile', host: 'shop.de', profile: null })).toBe(s);
  });

  it('stores hints', () => {
    const s = reducer(base, { type: 'setHint', hint: 'landscapeHintSeen', value: true });
    expect(s.hints.landscapeHintSeen).toBe(true);
    expect(reducer(s, { type: 'setHint', hint: 'landscapeHintSeen', value: true })).toBe(s);
  });

  it('replaces everything on hydrate', () => {
    const other = { ...createDefaultState(), bookmarks: [bm('x', 'https://x.de')] };
    expect(reducer(base, { type: 'hydrate', state: other })).toBe(other);
  });
});
