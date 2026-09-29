import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Bookmark, Settings, SiteProfile } from '../types';
import {
  createDefaultState,
  parsePersistedState,
  reducer,
  serializeState,
  STORAGE_KEY,
} from './reducer';
import type { Hints } from './reducer';

const WRITE_DELAY_MS = 400;

export interface AppStateValue {
  ready: boolean;
  settings: Settings;
  bookmarks: Bookmark[];
  siteProfiles: Record<string, SiteProfile>;
  hints: Hints;
  updateSettings(patch: Partial<Settings>): void;
  addBookmark(bookmark: { title: string; url: string }): void;
  removeBookmark(id: string): void;
  setSiteProfile(host: string, profile: SiteProfile | null): void;
  setHint(hint: keyof Hints, value?: boolean): void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createDefaultState);
  const [ready, setReady] = useState(false);
  const latest = useRef(state);
  latest.current = state;

  // Load once.
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!cancelled) dispatch({ type: 'hydrate', state: parsePersistedState(raw) });
      })
      .catch(() => {
        // Keep defaults when storage is unavailable.
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Debounced write after hydration.
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, serializeState(state)).catch(() => undefined);
    }, WRITE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [state, ready]);

  // Flush pending changes on unmount.
  useEffect(
    () => () => {
      AsyncStorage.setItem(STORAGE_KEY, serializeState(latest.current)).catch(() => undefined);
    },
    [],
  );

  const updateSettings = useCallback((patch: Partial<Settings>) => dispatch({ type: 'updateSettings', patch }), []);
  const addBookmark = useCallback(
    ({ title, url }: { title: string; url: string }) =>
      dispatch({ type: 'addBookmark', bookmark: { id: newId(), title: title || url, url, createdAt: Date.now() } }),
    [],
  );
  const removeBookmark = useCallback((id: string) => dispatch({ type: 'removeBookmark', id }), []);
  const setSiteProfile = useCallback(
    (host: string, profile: SiteProfile | null) => dispatch({ type: 'setSiteProfile', host, profile }),
    [],
  );
  const setHint = useCallback(
    (hint: keyof Hints, value: boolean = true) => dispatch({ type: 'setHint', hint, value }),
    [],
  );

  const value = useMemo<AppStateValue>(
    () => ({
      ready,
      settings: state.settings,
      bookmarks: state.bookmarks,
      siteProfiles: state.siteProfiles,
      hints: state.hints,
      updateSettings,
      addBookmark,
      removeBookmark,
      setSiteProfile,
      setHint,
    }),
    [ready, state, updateSettings, addBookmark, removeBookmark, setSiteProfile, setHint],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside <AppStateProvider>');
  return ctx;
}
