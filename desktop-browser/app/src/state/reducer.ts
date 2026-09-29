// Pure state logic for Deskview (no React / React Native imports, so it stays testable).
import { DEFAULT_AGENT_ID } from '../core/agents';
import { clampResolution, DEFAULT_RESOLUTION } from '../core/resolution';
import { TEST_PAGE_URL } from '../core/url';
import type {
  AgentId,
  Bookmark,
  Resolution,
  ScaleMode,
  SearchEngineId,
  Settings,
  SiteProfile,
} from '../types';

export const STORAGE_KEY = 'deskview/state/v1';

/** One-time UI hints that were already shown (kept outside of Settings). */
export interface Hints {
  trackpadHintSeen: boolean;
  landscapeHintSeen: boolean;
}

export interface PersistedState {
  settings: Settings;
  bookmarks: Bookmark[];
  siteProfiles: Record<string, SiteProfile>;
  hints: Hints;
}

export type Action =
  | { type: 'hydrate'; state: PersistedState }
  | { type: 'updateSettings'; patch: Partial<Settings> }
  | { type: 'addBookmark'; bookmark: Bookmark }
  | { type: 'removeBookmark'; id: string }
  | { type: 'setSiteProfile'; host: string; profile: SiteProfile | null }
  | { type: 'setHint'; hint: keyof Hints; value: boolean };

const AGENT_IDS: readonly AgentId[] = ['safari-mac', 'chrome-mac', 'chrome-win', 'edge-win', 'firefox-win'];
const SEARCH_ENGINE_IDS: readonly SearchEngineId[] = ['duckduckgo', 'google', 'bing', 'ecosia'];
const SCALE_MODES: readonly ScaleMode[] = ['fill', 'exact'];

export function createDefaultSettings(): Settings {
  return {
    resolution: { ...DEFAULT_RESOLUTION },
    scaleMode: 'fill',
    agentId: DEFAULT_AGENT_ID,
    desktopMode: true,
    searchEngine: 'duckduckgo',
    homeUrl: TEST_PAGE_URL,
    screenshotInfoBar: true,
    onboardingDone: false,
  };
}

export function createDefaultState(): PersistedState {
  return {
    settings: createDefaultSettings(),
    bookmarks: [],
    siteProfiles: {},
    hints: { trackpadHintSeen: false, landscapeHintSeen: false },
  };
}

// ---- Parsing helpers (robust against corrupt or outdated storage) ----

type Obj = Record<string, unknown>;

function isObj(v: unknown): v is Obj {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function oneOf<T extends string>(v: unknown, allowed: readonly T[], fallback: T): T {
  return typeof v === 'string' && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
}

function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === 'boolean' ? v : fallback;
}

function str(v: unknown, fallback: string): string {
  return typeof v === 'string' && v.length > 0 ? v : fallback;
}

function parseResolution(v: unknown, fallback: Resolution): Resolution {
  if (!isObj(v)) return { ...fallback };
  const { width, height } = v;
  if (typeof width !== 'number' || typeof height !== 'number' || !isFinite(width) || !isFinite(height)) {
    return { ...fallback };
  }
  return clampResolution({ width: Math.round(width), height: Math.round(height) });
}

export function parseSettings(v: unknown): Settings {
  const d = createDefaultSettings();
  if (!isObj(v)) return d;
  return {
    resolution: parseResolution(v.resolution, d.resolution),
    scaleMode: oneOf(v.scaleMode, SCALE_MODES, d.scaleMode),
    agentId: oneOf(v.agentId, AGENT_IDS, d.agentId),
    desktopMode: bool(v.desktopMode, d.desktopMode),
    searchEngine: oneOf(v.searchEngine, SEARCH_ENGINE_IDS, d.searchEngine),
    homeUrl: str(v.homeUrl, d.homeUrl),
    screenshotInfoBar: bool(v.screenshotInfoBar, d.screenshotInfoBar),
    onboardingDone: bool(v.onboardingDone, d.onboardingDone),
  };
}

function parseBookmarks(v: unknown): Bookmark[] {
  if (!Array.isArray(v)) return [];
  const result: Bookmark[] = [];
  for (const b of v) {
    if (!isObj(b) || typeof b.url !== 'string' || b.url.length === 0) continue;
    result.push({
      id: str(b.id, `bm-${result.length}-${b.url}`),
      title: typeof b.title === 'string' ? b.title : b.url,
      url: b.url,
      createdAt: typeof b.createdAt === 'number' ? b.createdAt : 0,
    });
  }
  return result;
}

function parseSiteProfiles(v: unknown): Record<string, SiteProfile> {
  const result: Record<string, SiteProfile> = {};
  if (!isObj(v)) return result;
  for (const [host, p] of Object.entries(v)) {
    if (!isObj(p) || host.length === 0) continue;
    result[host] = {
      host,
      resolution: parseResolution(p.resolution, DEFAULT_RESOLUTION),
      scaleMode: oneOf(p.scaleMode, SCALE_MODES, 'fill'),
    };
  }
  return result;
}

/** Parses stored JSON; never throws, falls back to defaults field by field. */
export function parsePersistedState(raw: string | null | undefined): PersistedState {
  const d = createDefaultState();
  if (!raw) return d;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return d;
  }
  if (!isObj(data)) return d;
  const hints = isObj(data.hints) ? data.hints : {};
  return {
    settings: parseSettings(data.settings),
    bookmarks: parseBookmarks(data.bookmarks),
    siteProfiles: parseSiteProfiles(data.siteProfiles),
    hints: {
      trackpadHintSeen: bool(hints.trackpadHintSeen, false),
      landscapeHintSeen: bool(hints.landscapeHintSeen, false),
    },
  };
}

export function serializeState(state: PersistedState): string {
  return JSON.stringify(state);
}

// ---- Reducer ----

export function reducer(state: PersistedState, action: Action): PersistedState {
  switch (action.type) {
    case 'hydrate':
      return action.state;

    case 'updateSettings': {
      const patch = { ...action.patch };
      if (patch.resolution) patch.resolution = clampResolution(patch.resolution);
      return { ...state, settings: { ...state.settings, ...patch } };
    }

    case 'addBookmark': {
      const { bookmark } = action;
      // Same URL again: replace (moves it to the top with the fresh title).
      const rest = state.bookmarks.filter((b) => b.url !== bookmark.url && b.id !== bookmark.id);
      return { ...state, bookmarks: [bookmark, ...rest] };
    }

    case 'removeBookmark': {
      if (!state.bookmarks.some((b) => b.id === action.id)) return state;
      return { ...state, bookmarks: state.bookmarks.filter((b) => b.id !== action.id) };
    }

    case 'setSiteProfile': {
      const { host, profile } = action;
      if (!host) return state;
      const next = { ...state.siteProfiles };
      if (profile === null) {
        if (!(host in next)) return state;
        delete next[host];
      } else {
        next[host] = { host, resolution: clampResolution(profile.resolution), scaleMode: profile.scaleMode };
      }
      return { ...state, siteProfiles: next };
    }

    case 'setHint':
      if (state.hints[action.hint] === action.value) return state;
      return { ...state, hints: { ...state.hints, [action.hint]: action.value } };

    default:
      return state;
  }
}
