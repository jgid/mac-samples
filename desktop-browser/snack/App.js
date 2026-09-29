// GENERATED – do not edit; source in desktop-browser/app
// Built by desktop-browser/app/scripts/build-snack.mjs (npm run build:snack).
// Deskview – desktop web viewer for iPhone. Load in Expo Snack / Expo Go.


// App.tsx
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar as StatusBar2 } from "expo-status-bar";
import { useEffect as useEffect9 } from "react";
import { View as View14 } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// src/screens/BrowserScreen.tsx
import { Ionicons as Ionicons11 } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics2 from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { useCallback as useCallback6, useEffect as useEffect8, useMemo as useMemo6, useRef as useRef7, useState as useState7 } from "react";
import { Alert, Pressable as Pressable12, StyleSheet as StyleSheet15, useWindowDimensions, View as View13 } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// src/core/agents.ts
var MAC = "Macintosh; Intel Mac OS X 10_15_7";
var WIN = "Windows NT 10.0; Win64; x64";
var AGENTS = [
  {
    id: "safari-mac",
    label: "Safari auf Mac",
    userAgent: `Mozilla/5.0 (${MAC}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15`,
    platform: "MacIntel",
    vendor: "Apple Computer, Inc."
  },
  {
    id: "chrome-mac",
    label: "Chrome auf Mac",
    userAgent: `Mozilla/5.0 (${MAC}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36`,
    platform: "MacIntel",
    vendor: "Google Inc."
  },
  {
    id: "chrome-win",
    label: "Chrome auf Windows",
    userAgent: `Mozilla/5.0 (${WIN}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36`,
    platform: "Win32",
    vendor: "Google Inc."
  },
  {
    id: "edge-win",
    label: "Edge auf Windows",
    userAgent: `Mozilla/5.0 (${WIN}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0`,
    platform: "Win32",
    vendor: "Google Inc."
  },
  {
    id: "firefox-win",
    label: "Firefox auf Windows",
    userAgent: `Mozilla/5.0 (${WIN}; rv:143.0) Gecko/20100101 Firefox/143.0`,
    platform: "Win32",
    vendor: ""
  }
];
var DEFAULT_AGENT_ID = "safari-mac";
function getAgent(id) {
  return AGENTS.find((a) => a.id === id) ?? AGENTS.find((a) => a.id === DEFAULT_AGENT_ID);
}

// src/core/resolution.ts
var MIN_WIDTH = 320;
var MAX_WIDTH = 7680;
var MIN_HEIGHT = 240;
var MAX_HEIGHT = 4320;
var FILL_MAX_HEIGHT_FACTOR = 2;
var DEFAULT_RESOLUTION = { width: 1920, height: 1080 };
var PRESETS = [
  { id: "laptop-small", label: "Kleiner Laptop", detail: "Ältere oder kompakte Notebooks", group: "laptop", width: 1280, height: 800 },
  { id: "laptop-hd", label: "Laptop HD (Windows)", detail: "Günstige Windows-Notebooks, sehr verbreitet", group: "laptop", width: 1366, height: 768 },
  { id: "macbook-air-1440", label: "MacBook Air 13″ (bis 2020)", detail: "Ältere Mac-Laptops, sehr verbreitet", group: "laptop", width: 1440, height: 900 },
  { id: "macbook-air-13", label: "MacBook Air 13″", detail: "Typischer Mac-Laptop (Standard-Skalierung)", group: "laptop", width: 1470, height: 956 },
  { id: "macbook-pro-14", label: "MacBook Pro 14″", detail: "Mac-Laptop für Profis", group: "laptop", width: 1512, height: 982 },
  { id: "laptop-15-win", label: "Laptop 15″ Windows 125 %", detail: "Full-HD-Notebook mit 125 % Skalierung", group: "laptop", width: 1536, height: 864 },
  { id: "macbook-pro-16", label: "MacBook Pro 16″", detail: "Großer Mac-Laptop", group: "laptop", width: 1728, height: 1117 },
  { id: "monitor-fullhd", label: "Full-HD-Monitor", detail: "Häufigste Desktop-Auflösung", group: "desktop", width: 1920, height: 1080 },
  { id: "imac-24", label: "iMac 24″", detail: "All-in-one-Mac (Standard-Skalierung)", group: "desktop", width: 2240, height: 1260 },
  { id: "imac-27", label: "iMac 27″ / WQHD-Monitor", detail: "Großer iMac oder 27″-Monitor bei 100 %", group: "desktop", width: 2560, height: 1440 },
  { id: "studio-display-more", label: "Studio Display 27″ (mehr Platz)", detail: "5K-Display mit maximaler Arbeitsfläche", group: "large", width: 3200, height: 1800 },
  { id: "ultrawide", label: "Ultrawide-Monitor", detail: "34″ im 21:9-Format", group: "large", width: 3440, height: 1440 },
  { id: "monitor-4k", label: "4K-Monitor (100 %)", detail: "Riesige Arbeitsfläche ohne Skalierung", group: "large", width: 3840, height: 2160 }
];
var PRESET_GROUP_LABELS = {
  laptop: "Laptops",
  desktop: "Monitore",
  large: "Große Bildschirme"
};
function clampNumber(v, min, max, fallback) {
  if (!Number.isFinite(v)) return fallback;
  return Math.min(max, Math.max(min, Math.round(v)));
}
function clampResolution(r) {
  return {
    width: clampNumber(r?.width, MIN_WIDTH, MAX_WIDTH, DEFAULT_RESOLUTION.width),
    height: clampNumber(r?.height, MIN_HEIGHT, MAX_HEIGHT, DEFAULT_RESOLUTION.height)
  };
}
function findPreset(r) {
  return PRESETS.find((p) => p.width === r.width && p.height === r.height);
}
function computeGeometry(containerWidth, containerHeight, r, mode) {
  const res = clampResolution(r);
  const cw = Number.isFinite(containerWidth) && containerWidth > 0 ? containerWidth : 0;
  const ch = Number.isFinite(containerHeight) && containerHeight > 0 ? containerHeight : 0;
  if (cw === 0 || ch === 0) {
    return { cssWidth: res.width, cssHeight: res.height, scale: 1, offsetX: 0, offsetY: 0 };
  }
  if (mode === "exact") {
    const scale2 = Math.min(cw / res.width, ch / res.height);
    return {
      cssWidth: res.width,
      cssHeight: res.height,
      scale: scale2,
      offsetX: (cw - res.width * scale2) / 2,
      offsetY: (ch - res.height * scale2) / 2
    };
  }
  const scale = cw / res.width;
  const maxHeight = res.height * FILL_MAX_HEIGHT_FACTOR;
  return {
    cssWidth: res.width,
    cssHeight: Math.max(1, Math.min(maxHeight, Math.round(ch / scale))),
    scale,
    offsetX: 0,
    offsetY: 0
  };
}
function formatResolution(r) {
  return `${Math.round(r.width)} × ${Math.round(r.height)}`;
}
function formatScale(scale) {
  if (!Number.isFinite(scale)) return "– %";
  return `${Math.round(scale * 100)} %`;
}

// src/core/url.ts
var TEST_PAGE_URL = "deskview://test";
var SEARCH_ENGINES = [
  { id: "duckduckgo", label: "DuckDuckGo" },
  { id: "google", label: "Google" },
  { id: "bing", label: "Bing" },
  { id: "ecosia", label: "Ecosia" }
];
var SEARCH_URLS = {
  duckduckgo: "https://duckduckgo.com/?q=",
  google: "https://www.google.com/search?q=",
  bing: "https://www.bing.com/search?q=",
  ecosia: "https://www.ecosia.org/search?q="
};
function searchUrl(query, engine) {
  const base = SEARCH_URLS[engine] ?? SEARCH_URLS.duckduckgo;
  return base + encodeURIComponent(query);
}
var PASSTHROUGH = /^(https?:\/\/|about:|data:)/i;
var HOST_LIKE = /^(\[[0-9a-f:.]+\]|[^\s/?#:@[\]]+)(:(\d{1,5}))?([/?#].*)?$/i;
var IPV4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
var DOMAIN = /^(?=.{1,253}$)([a-z0-9¡-￿]([a-z0-9¡-￿-]{0,61}[a-z0-9¡-￿])?\.)+([a-z¡-￿]{2,63}|xn--[a-z0-9-]{1,59})$/i;
var LOCAL_SUFFIX = /\.(box|local|lan|home|internal|localdomain)$/i;
function isLocalHost(host) {
  const h = host.toLowerCase();
  return h === "localhost" || h.endsWith(".localhost") || IPV4.test(h) || h.startsWith("[") || LOCAL_SUFFIX.test(h);
}
function resolveInput(input, engine) {
  const text = (input ?? "").trim();
  if (!text) return null;
  if (text.toLowerCase() === TEST_PAGE_URL) return TEST_PAGE_URL;
  if (PASSTHROUGH.test(text)) return text;
  if (!/\s/.test(text)) {
    const m = HOST_LIKE.exec(text);
    if (m) {
      const host = m[1];
      const hasPort = m[3] !== void 0;
      const port = hasPort ? Number(m[3]) : 0;
      const portOk = !hasPort || port > 0 && port <= 65535;
      const lower = host.toLowerCase();
      const isKnownHost = lower === "localhost" || IPV4.test(lower) || host.startsWith("[") && host.includes(":") || DOMAIN.test(host) || LOCAL_SUFFIX.test(lower) && !lower.startsWith(".") || // single-label intranet host with explicit port, e.g. "nas:5000"
      hasPort && /^[a-z0-9-]+$/i.test(host);
      if (isKnownHost && portOk) {
        const scheme = isLocalHost(lower) || hasPort && !lower.includes(".") ? "http://" : "https://";
        return scheme + text;
      }
    }
  }
  return searchUrl(text, engine);
}
function hostOf(url) {
  if (!url || url === TEST_PAGE_URL) return null;
  const m = /^https?:\/\/(?:[^@/?#]*@)?(\[[^\]/]+\]|[^:/?#]+)/i.exec(url.trim());
  if (!m || !m[1]) return null;
  return m[1].toLowerCase();
}
function displayUrl(url) {
  if (!url) return "";
  if (url === TEST_PAGE_URL) return "Testseite";
  if (!/^https?:\/\//i.test(url)) return url;
  let s = url.replace(/^https?:\/\//i, "");
  s = s.replace(/^www\./i, "");
  if (s.endsWith("/")) s = s.slice(0, -1);
  return s;
}

// src/state/AppState.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";

// src/state/reducer.ts
var STORAGE_KEY = "deskview/state/v1";
var AGENT_IDS = ["safari-mac", "chrome-mac", "chrome-win", "edge-win", "firefox-win"];
var SEARCH_ENGINE_IDS = ["duckduckgo", "google", "bing", "ecosia"];
var SCALE_MODES = ["fill", "exact"];
function createDefaultSettings() {
  return {
    resolution: { ...DEFAULT_RESOLUTION },
    scaleMode: "fill",
    agentId: DEFAULT_AGENT_ID,
    desktopMode: true,
    searchEngine: "duckduckgo",
    homeUrl: TEST_PAGE_URL,
    screenshotInfoBar: true,
    onboardingDone: false
  };
}
function createDefaultState() {
  return {
    settings: createDefaultSettings(),
    bookmarks: [],
    siteProfiles: {},
    hints: { trackpadHintSeen: false, landscapeHintSeen: false }
  };
}
function isObj(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function oneOf(v, allowed, fallback) {
  return typeof v === "string" && allowed.includes(v) ? v : fallback;
}
function bool(v, fallback) {
  return typeof v === "boolean" ? v : fallback;
}
function str(v, fallback) {
  return typeof v === "string" && v.length > 0 ? v : fallback;
}
function parseResolution(v, fallback) {
  if (!isObj(v)) return { ...fallback };
  const { width, height } = v;
  if (typeof width !== "number" || typeof height !== "number" || !isFinite(width) || !isFinite(height)) {
    return { ...fallback };
  }
  return clampResolution({ width: Math.round(width), height: Math.round(height) });
}
function parseSettings(v) {
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
    onboardingDone: bool(v.onboardingDone, d.onboardingDone)
  };
}
function parseBookmarks(v) {
  if (!Array.isArray(v)) return [];
  const result = [];
  for (const b of v) {
    if (!isObj(b) || typeof b.url !== "string" || b.url.length === 0) continue;
    result.push({
      id: str(b.id, `bm-${result.length}-${b.url}`),
      title: typeof b.title === "string" ? b.title : b.url,
      url: b.url,
      createdAt: typeof b.createdAt === "number" ? b.createdAt : 0
    });
  }
  return result;
}
function parseSiteProfiles(v) {
  const result = {};
  if (!isObj(v)) return result;
  for (const [host, p] of Object.entries(v)) {
    if (!isObj(p) || host.length === 0) continue;
    result[host] = {
      host,
      resolution: parseResolution(p.resolution, DEFAULT_RESOLUTION),
      scaleMode: oneOf(p.scaleMode, SCALE_MODES, "fill")
    };
  }
  return result;
}
function parsePersistedState(raw) {
  const d = createDefaultState();
  if (!raw) return d;
  let data;
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
      landscapeHintSeen: bool(hints.landscapeHintSeen, false)
    }
  };
}
function serializeState(state) {
  return JSON.stringify(state);
}
function reducer(state, action) {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "updateSettings": {
      const patch = { ...action.patch };
      if (patch.resolution) patch.resolution = clampResolution(patch.resolution);
      return { ...state, settings: { ...state.settings, ...patch } };
    }
    case "addBookmark": {
      const { bookmark } = action;
      const rest = state.bookmarks.filter((b) => b.url !== bookmark.url && b.id !== bookmark.id);
      return { ...state, bookmarks: [bookmark, ...rest] };
    }
    case "removeBookmark": {
      if (!state.bookmarks.some((b) => b.id === action.id)) return state;
      return { ...state, bookmarks: state.bookmarks.filter((b) => b.id !== action.id) };
    }
    case "setSiteProfile": {
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
    case "setHint":
      if (state.hints[action.hint] === action.value) return state;
      return { ...state, hints: { ...state.hints, [action.hint]: action.value } };
    default:
      return state;
  }
}

// src/state/AppState.tsx
import { jsx } from "react/jsx-runtime";
var WRITE_DELAY_MS = 400;
var AppStateContext = createContext(null);
function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, void 0, createDefaultState);
  const [ready, setReady] = useState(false);
  const latest = useRef(state);
  latest.current = state;
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!cancelled) dispatch({ type: "hydrate", state: parsePersistedState(raw) });
    }).catch(() => {
    }).finally(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, serializeState(state)).catch(() => void 0);
    }, WRITE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [state, ready]);
  useEffect(
    () => () => {
      AsyncStorage.setItem(STORAGE_KEY, serializeState(latest.current)).catch(() => void 0);
    },
    []
  );
  const updateSettings = useCallback((patch) => dispatch({ type: "updateSettings", patch }), []);
  const addBookmark = useCallback(
    ({ title, url }) => dispatch({ type: "addBookmark", bookmark: { id: newId(), title: title || url, url, createdAt: Date.now() } }),
    []
  );
  const removeBookmark = useCallback((id) => dispatch({ type: "removeBookmark", id }), []);
  const setSiteProfile = useCallback(
    (host, profile) => dispatch({ type: "setSiteProfile", host, profile }),
    []
  );
  const setHint = useCallback(
    (hint, value2 = true) => dispatch({ type: "setHint", hint, value: value2 }),
    []
  );
  const value = useMemo(
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
      setHint
    }),
    [ready, state, updateSettings, addBookmark, removeBookmark, setSiteProfile, setHint]
  );
  return /* @__PURE__ */ jsx(AppStateContext.Provider, { value, children });
}
function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside <AppStateProvider>");
  return ctx;
}

// src/ui/AddressBar.tsx
import { Ionicons } from "@expo/vector-icons";
import { memo, useCallback as useCallback2, useRef as useRef2, useState as useState2 } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

// src/ui/theme.ts
import { useColorScheme } from "react-native";
var light = {
  background: "#FFFFFF",
  groupedBackground: "#F2F2F7",
  surface: "#FFFFFF",
  surfaceElevated: "#FFFFFF",
  chrome: "#F7F7F9",
  text: "#000000",
  textSecondary: "#6C6C70",
  textTertiary: "#AEAEB2",
  separator: "#D1D1D6",
  tint: "#007AFF",
  tintSoft: "rgba(0,122,255,0.12)",
  onTint: "#FFFFFF",
  danger: "#FF3B30",
  success: "#34C759",
  warning: "#FF9500",
  fieldBackground: "#E9E9EE",
  overlay: "rgba(0,0,0,0.35)",
  chipBackground: "rgba(28,28,30,0.72)",
  chipText: "#FFFFFF",
  viewportBackground: "#1C1C1E"
};
var dark = {
  background: "#000000",
  groupedBackground: "#000000",
  surface: "#1C1C1E",
  surfaceElevated: "#2C2C2E",
  chrome: "#161618",
  text: "#FFFFFF",
  textSecondary: "#AEAEB2",
  textTertiary: "#636366",
  separator: "#38383A",
  tint: "#0A84FF",
  tintSoft: "rgba(10,132,255,0.22)",
  onTint: "#FFFFFF",
  danger: "#FF453A",
  success: "#30D158",
  warning: "#FF9F0A",
  fieldBackground: "#2C2C2E",
  overlay: "rgba(0,0,0,0.55)",
  chipBackground: "rgba(44,44,46,0.8)",
  chipText: "#FFFFFF",
  viewportBackground: "#0B0B0C"
};
var spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
var radius = { sm: 6, md: 10, lg: 14, xl: 20, pill: 999 };
var fontSize = { caption: 12, footnote: 13, body: 17, subhead: 15, title: 20, largeTitle: 28 };
var HIT = 44;
var SHEET_ORIENTATIONS = [
  "portrait",
  "portrait-upside-down",
  "landscape",
  "landscape-left",
  "landscape-right"
];
var LIGHT_THEME = { dark: false, colors: light };
var DARK_THEME = { dark: true, colors: dark };
function useTheme() {
  return useColorScheme() === "dark" ? DARK_THEME : LIGHT_THEME;
}

// src/ui/AddressBar.tsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function AddressBarImpl({ url, loading, progress, searchEngine, onNavigate, onReload, onStop }) {
  const { colors } = useTheme();
  const inputRef = useRef2(null);
  const [focused, setFocused] = useState2(false);
  const [text, setText] = useState2("");
  const isTestPage = url === TEST_PAGE_URL;
  const secure = url.startsWith("https://");
  const shown = isTestPage ? "Testseite" : url ? displayUrl(url) : "";
  const onFocus = useCallback2(() => {
    setText(url);
    setFocused(true);
  }, [url]);
  const onBlur = useCallback2(() => setFocused(false), []);
  const onSubmit = useCallback2(() => {
    const target = resolveInput(text.trim(), searchEngine);
    inputRef.current?.blur();
    if (target) onNavigate(target);
  }, [text, searchEngine, onNavigate]);
  const cancel = useCallback2(() => inputRef.current?.blur(), []);
  return /* @__PURE__ */ jsxs(View, { style: [styles.wrap, { backgroundColor: colors.chrome, borderBottomColor: colors.separator }], children: [
    /* @__PURE__ */ jsxs(View, { style: styles.line, children: [
      /* @__PURE__ */ jsxs(View, { style: [styles.field, { backgroundColor: colors.fieldBackground }], children: [
        !focused ? /* @__PURE__ */ jsx2(
          Ionicons,
          {
            name: isTestPage ? "information-circle" : secure ? "lock-closed" : "globe-outline",
            size: 14,
            color: colors.textSecondary,
            style: styles.leading,
            accessibilityLabel: isTestPage ? "Testseite" : secure ? "Sichere Verbindung" : "Unverschlüsselte Verbindung"
          }
        ) : /* @__PURE__ */ jsx2(Ionicons, { name: "search", size: 15, color: colors.textSecondary, style: styles.leading }),
        /* @__PURE__ */ jsx2(
          TextInput,
          {
            ref: inputRef,
            value: focused ? text : shown,
            onChangeText: setText,
            onFocus,
            onBlur,
            onSubmitEditing: onSubmit,
            placeholder: "Adresse oder Suchbegriff",
            placeholderTextColor: colors.textSecondary,
            style: [styles.input, { color: colors.text, textAlign: focused ? "left" : "center" }],
            autoCapitalize: "none",
            autoCorrect: false,
            autoComplete: "off",
            spellCheck: false,
            keyboardType: "web-search",
            returnKeyType: "go",
            selectTextOnFocus: true,
            clearButtonMode: "while-editing",
            accessibilityLabel: "Adressleiste",
            accessibilityHint: "Adresse oder Suchbegriff eingeben"
          }
        ),
        !focused ? /* @__PURE__ */ jsx2(
          Pressable,
          {
            onPress: loading ? onStop : onReload,
            hitSlop: 8,
            style: styles.trailing,
            accessibilityRole: "button",
            accessibilityLabel: loading ? "Laden stoppen" : "Neu laden",
            children: /* @__PURE__ */ jsx2(Ionicons, { name: loading ? "close" : "refresh", size: 18, color: colors.text })
          }
        ) : null
      ] }),
      focused ? /* @__PURE__ */ jsx2(Pressable, { onPress: cancel, style: styles.cancel, accessibilityRole: "button", accessibilityLabel: "Abbrechen", children: /* @__PURE__ */ jsx2(Text, { style: [styles.cancelText, { color: colors.tint }], children: "Abbrechen" }) }) : null
    ] }),
    /* @__PURE__ */ jsx2(View, { style: styles.progressTrack, pointerEvents: "none", children: loading ? /* @__PURE__ */ jsx2(
      View,
      {
        style: [
          styles.progressBar,
          { backgroundColor: colors.tint, width: `${Math.max(5, Math.min(100, progress * 100))}%` }
        ]
      }
    ) : null })
  ] });
}
var AddressBar = memo(AddressBarImpl);
var styles = StyleSheet.create({
  wrap: { borderBottomWidth: StyleSheet.hairlineWidth },
  line: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm - 2,
    gap: spacing.sm
  },
  field: {
    flex: 1,
    height: 40,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center"
  },
  leading: { marginLeft: spacing.md, width: 16 },
  input: { flex: 1, height: 40, fontSize: fontSize.body - 1, paddingHorizontal: spacing.sm },
  trailing: { width: HIT - 4, height: 40, alignItems: "center", justifyContent: "center" },
  cancel: { height: HIT, justifyContent: "center" },
  cancelText: { fontSize: fontSize.body },
  progressTrack: { height: 2 },
  progressBar: { height: 2 }
});

// src/ui/BookmarksSheet.tsx
import { Ionicons as Ionicons3 } from "@expo/vector-icons";
import { Pressable as Pressable3, StyleSheet as StyleSheet3, Text as Text3, View as View3 } from "react-native";

// src/ui/Sheet.tsx
import { Ionicons as Ionicons2 } from "@expo/vector-icons";
import { Modal, Pressable as Pressable2, ScrollView, StyleSheet as StyleSheet2, Switch, Text as Text2, View as View2 } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function Sheet({
  visible,
  title,
  onClose,
  closeLabel = "Fertig",
  children
}) {
  const { colors } = useTheme();
  return /* @__PURE__ */ jsx3(
    Modal,
    {
      visible,
      animationType: "slide",
      presentationStyle: "pageSheet",
      supportedOrientations: SHEET_ORIENTATIONS,
      onRequestClose: onClose,
      children: /* @__PURE__ */ jsxs2(View2, { style: [styles2.frame, { backgroundColor: colors.groupedBackground }], children: [
        /* @__PURE__ */ jsxs2(View2, { style: [styles2.header, { borderBottomColor: colors.separator }], children: [
          /* @__PURE__ */ jsx3(Text2, { style: [styles2.title, { color: colors.text }], accessibilityRole: "header", numberOfLines: 1, children: title }),
          /* @__PURE__ */ jsx3(
            Pressable2,
            {
              onPress: onClose,
              style: styles2.close,
              hitSlop: 8,
              accessibilityRole: "button",
              accessibilityLabel: closeLabel,
              children: /* @__PURE__ */ jsx3(Text2, { style: [styles2.closeText, { color: colors.tint }], children: closeLabel })
            }
          )
        ] }),
        /* @__PURE__ */ jsx3(SafeAreaView, { edges: ["bottom", "left", "right"], style: styles2.frame, children: /* @__PURE__ */ jsx3(
          ScrollView,
          {
            contentContainerStyle: styles2.content,
            keyboardShouldPersistTaps: "handled",
            keyboardDismissMode: "interactive",
            automaticallyAdjustKeyboardInsets: true,
            children
          }
        ) })
      ] })
    }
  );
}
function Section({ title, footer, children }) {
  const { colors } = useTheme();
  return /* @__PURE__ */ jsxs2(View2, { style: styles2.section, children: [
    title ? /* @__PURE__ */ jsx3(Text2, { style: [styles2.sectionTitle, { color: colors.textSecondary }], children: title }) : null,
    /* @__PURE__ */ jsx3(View2, { style: [styles2.sectionBody, { backgroundColor: colors.surface }], children }),
    footer ? typeof footer === "string" ? /* @__PURE__ */ jsx3(Text2, { style: [styles2.footer, { color: colors.textSecondary }], children: footer }) : /* @__PURE__ */ jsx3(View2, { style: styles2.footerBox, children: footer }) : null
  ] });
}
function Separator({ inset = spacing.lg }) {
  const { colors } = useTheme();
  return /* @__PURE__ */ jsx3(View2, { style: { marginLeft: inset, height: StyleSheet2.hairlineWidth, backgroundColor: colors.separator } });
}
function Row({
  title,
  subtitle,
  detail,
  icon,
  onPress,
  checked,
  chevron,
  destructive,
  disabled,
  right,
  accessibilityLabel,
  accessibilityHint
}) {
  const { colors } = useTheme();
  const titleColor = disabled ? colors.textTertiary : destructive ? colors.danger : colors.text;
  return /* @__PURE__ */ jsxs2(
    Pressable2,
    {
      onPress,
      disabled: disabled || !onPress,
      accessibilityRole: onPress ? "button" : void 0,
      accessibilityLabel,
      accessibilityHint,
      accessibilityState: { disabled: !!disabled, selected: checked },
      style: ({ pressed }) => [styles2.row, pressed && onPress ? { backgroundColor: colors.fieldBackground } : null],
      children: [
        icon ? /* @__PURE__ */ jsx3(
          Ionicons2,
          {
            name: icon,
            size: 22,
            color: disabled ? colors.textTertiary : destructive ? colors.danger : colors.tint,
            style: styles2.rowIcon
          }
        ) : null,
        /* @__PURE__ */ jsxs2(View2, { style: styles2.rowText, children: [
          /* @__PURE__ */ jsx3(Text2, { style: [styles2.rowTitle, { color: titleColor }], numberOfLines: 2, children: title }),
          subtitle ? /* @__PURE__ */ jsx3(Text2, { style: [styles2.rowSubtitle, { color: colors.textSecondary }], children: subtitle }) : null
        ] }),
        detail ? /* @__PURE__ */ jsx3(Text2, { style: [styles2.rowDetail, { color: colors.textSecondary }], children: detail }) : null,
        right,
        checked ? /* @__PURE__ */ jsx3(Ionicons2, { name: "checkmark", size: 22, color: colors.tint, accessibilityLabel: "Ausgewählt" }) : null,
        chevron ? /* @__PURE__ */ jsx3(Ionicons2, { name: "chevron-forward", size: 18, color: colors.textTertiary }) : null
      ]
    }
  );
}
function SwitchRow({
  title,
  subtitle,
  value,
  onValueChange,
  disabled
}) {
  const { colors } = useTheme();
  return /* @__PURE__ */ jsxs2(View2, { style: styles2.row, children: [
    /* @__PURE__ */ jsxs2(View2, { style: styles2.rowText, children: [
      /* @__PURE__ */ jsx3(Text2, { style: [styles2.rowTitle, { color: disabled ? colors.textTertiary : colors.text }], children: title }),
      subtitle ? /* @__PURE__ */ jsx3(Text2, { style: [styles2.rowSubtitle, { color: colors.textSecondary }], children: subtitle }) : null
    ] }),
    /* @__PURE__ */ jsx3(
      Switch,
      {
        value,
        onValueChange,
        disabled,
        accessibilityLabel: title,
        trackColor: { true: colors.success }
      }
    )
  ] });
}
var styles2 = StyleSheet2.create({
  frame: { flex: 1 },
  header: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: StyleSheet2.hairlineWidth,
    paddingHorizontal: 96
  },
  title: { fontSize: fontSize.body, fontWeight: "600" },
  close: { position: "absolute", right: spacing.lg, top: 0, bottom: 0, justifyContent: "center", minWidth: HIT },
  closeText: { fontSize: fontSize.body, fontWeight: "600", textAlign: "right" },
  content: { paddingVertical: spacing.lg, paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  section: { marginBottom: spacing.xl },
  sectionTitle: {
    fontSize: fontSize.footnote,
    textTransform: "uppercase",
    marginBottom: spacing.xs + 2,
    marginLeft: spacing.lg
  },
  sectionBody: { borderRadius: radius.md, overflow: "hidden" },
  footer: { fontSize: fontSize.footnote, marginTop: spacing.xs + 2, marginHorizontal: spacing.lg, lineHeight: 18 },
  footerBox: { marginTop: spacing.xs + 2, marginHorizontal: spacing.lg },
  row: {
    minHeight: HIT + 4,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    gap: spacing.md
  },
  rowIcon: { width: 26, textAlign: "center" },
  rowText: { flex: 1 },
  rowTitle: { fontSize: fontSize.body },
  rowSubtitle: { fontSize: fontSize.footnote, marginTop: 2 },
  rowDetail: { fontSize: fontSize.subhead }
});

// src/ui/BookmarksSheet.tsx
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function shortUrl(url) {
  return url === TEST_PAGE_URL ? "Testseite" : displayUrl(url);
}
function BookmarksSheet({ visible, onClose, currentUrl, currentTitle, onOpen }) {
  const { colors } = useTheme();
  const { bookmarks, addBookmark, removeBookmark } = useAppState();
  const alreadySaved = bookmarks.some((b) => b.url === currentUrl);
  const canAdd = !!currentUrl && !alreadySaved;
  return /* @__PURE__ */ jsxs3(Sheet, { visible, title: "Lesezeichen", onClose, children: [
    /* @__PURE__ */ jsx4(Section, { footer: alreadySaved ? "Diese Seite ist bereits gespeichert." : void 0, children: /* @__PURE__ */ jsx4(
      Row,
      {
        icon: "add-circle-outline",
        title: "Aktuelle Seite hinzufügen",
        subtitle: currentUrl ? currentTitle || shortUrl(currentUrl) : void 0,
        disabled: !canAdd,
        onPress: () => addBookmark({ title: currentTitle || shortUrl(currentUrl), url: currentUrl })
      }
    ) }),
    /* @__PURE__ */ jsx4(Section, { title: "Gespeichert", children: bookmarks.length === 0 ? /* @__PURE__ */ jsxs3(View3, { style: styles3.empty, children: [
      /* @__PURE__ */ jsx4(Ionicons3, { name: "book-outline", size: 28, color: colors.textTertiary }),
      /* @__PURE__ */ jsx4(Text3, { style: [styles3.emptyText, { color: colors.textSecondary }], children: "Noch keine Lesezeichen. Öffne eine Seite und tippe auf „Aktuelle Seite hinzufügen“." })
    ] }) : bookmarks.map((b, i) => /* @__PURE__ */ jsxs3(View3, { children: [
      i > 0 ? /* @__PURE__ */ jsx4(Separator, {}) : null,
      /* @__PURE__ */ jsx4(
        Row,
        {
          title: b.title,
          subtitle: shortUrl(b.url),
          onPress: () => {
            onOpen(b.url);
            onClose();
          },
          accessibilityLabel: `${b.title} öffnen`,
          right: /* @__PURE__ */ jsx4(
            Pressable3,
            {
              onPress: () => removeBookmark(b.id),
              style: styles3.trash,
              accessibilityRole: "button",
              accessibilityLabel: `Lesezeichen ${b.title} löschen`,
              children: /* @__PURE__ */ jsx4(Ionicons3, { name: "trash-outline", size: 20, color: colors.danger })
            }
          )
        }
      )
    ] }, b.id)) })
  ] });
}
var styles3 = StyleSheet3.create({
  empty: { alignItems: "center", padding: spacing.xl, gap: spacing.sm },
  emptyText: { fontSize: fontSize.subhead, textAlign: "center", lineHeight: 21 },
  trash: { width: HIT, height: HIT, alignItems: "center", justifyContent: "center", marginRight: -spacing.sm }
});

// src/ui/InfoCard.tsx
import { Ionicons as Ionicons4 } from "@expo/vector-icons";
import { Pressable as Pressable4, StyleSheet as StyleSheet4, Text as Text4, View as View4 } from "react-native";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
function InfoCard({
  icon,
  tone = "info",
  title,
  message,
  actions,
  onClose,
  style
}) {
  const { colors } = useTheme();
  const accent = tone === "error" ? colors.danger : colors.tint;
  return /* @__PURE__ */ jsxs4(
    View4,
    {
      style: [styles4.card, { backgroundColor: colors.surfaceElevated }, style],
      accessibilityRole: tone === "error" ? "alert" : void 0,
      accessibilityLiveRegion: "polite",
      children: [
        /* @__PURE__ */ jsxs4(View4, { style: styles4.head, children: [
          /* @__PURE__ */ jsx5(Ionicons4, { name: icon, size: 22, color: accent, style: styles4.icon }),
          /* @__PURE__ */ jsxs4(View4, { style: styles4.text, children: [
            /* @__PURE__ */ jsx5(Text4, { style: [styles4.title, { color: colors.text }], children: title }),
            message ? /* @__PURE__ */ jsx5(Text4, { style: [styles4.message, { color: colors.textSecondary }], children: message }) : null
          ] }),
          onClose ? /* @__PURE__ */ jsx5(Pressable4, { onPress: onClose, hitSlop: 10, style: styles4.close, accessibilityRole: "button", accessibilityLabel: "Schließen", children: /* @__PURE__ */ jsx5(Ionicons4, { name: "close", size: 20, color: colors.textSecondary }) }) : null
        ] }),
        actions && actions.length > 0 ? /* @__PURE__ */ jsx5(View4, { style: styles4.actions, children: actions.map((a) => /* @__PURE__ */ jsx5(
          Pressable4,
          {
            onPress: a.onPress,
            accessibilityRole: "button",
            style: ({ pressed }) => [
              styles4.action,
              { backgroundColor: a.primary ? accent : colors.fieldBackground },
              pressed ? { opacity: 0.8 } : null
            ],
            children: /* @__PURE__ */ jsx5(Text4, { style: [styles4.actionText, { color: a.primary ? colors.onTint : colors.text }], children: a.label })
          },
          a.label
        )) }) : null
      ]
    }
  );
}
var styles4 = StyleSheet4.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6
  },
  head: { flexDirection: "row", alignItems: "flex-start" },
  icon: { marginRight: spacing.md, marginTop: 1 },
  text: { flex: 1 },
  title: { fontSize: fontSize.body - 1, fontWeight: "600" },
  message: { fontSize: fontSize.subhead - 1, marginTop: 3, lineHeight: 19 },
  close: { width: 28, height: 28, alignItems: "center", justifyContent: "center", marginLeft: spacing.sm },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: spacing.sm, marginTop: spacing.md },
  action: { minHeight: HIT - 6, paddingHorizontal: spacing.lg, borderRadius: radius.md, justifyContent: "center" },
  actionText: { fontSize: fontSize.subhead, fontWeight: "600" }
});

// src/ui/OnboardingSheet.tsx
import { Ionicons as Ionicons5 } from "@expo/vector-icons";
import { Modal as Modal2, Pressable as Pressable5, ScrollView as ScrollView2, StyleSheet as StyleSheet5, Text as Text5, View as View5 } from "react-native";
import { SafeAreaView as SafeAreaView2 } from "react-native-safe-area-context";
import { jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
var POINTS = [
  {
    icon: "desktop-outline",
    title: "Echt",
    text: "Websites werden wirklich so aufgebaut wie auf einem Monitor deiner Wahl – nicht nur verkleinert. Die aktuelle Größe siehst du immer oben."
  },
  {
    icon: "navigate-outline",
    title: "Bedienbar",
    text: "Im Maus-Modus steuerst du einen Mauszeiger wie am Laptop. So öffnen sich auch Menüs, die nur bei Mausberührung aufklappen."
  },
  {
    icon: "camera-outline",
    title: "Belegbar",
    text: "Screenshots in voller Größe – mit Adresse, Bildschirmgröße und Uhrzeit. Direkt teilen, etwa per Mail, Slack oder Jira."
  }
];
function OnboardingSheet({ visible, onDone }) {
  const { colors } = useTheme();
  return /* @__PURE__ */ jsx6(
    Modal2,
    {
      visible,
      animationType: "slide",
      presentationStyle: "pageSheet",
      supportedOrientations: SHEET_ORIENTATIONS,
      onRequestClose: onDone,
      children: /* @__PURE__ */ jsxs5(SafeAreaView2, { edges: ["bottom", "left", "right"], style: [styles5.frame, { backgroundColor: colors.background }], children: [
        /* @__PURE__ */ jsxs5(ScrollView2, { contentContainerStyle: styles5.content, children: [
          /* @__PURE__ */ jsx6(View5, { style: [styles5.logo, { backgroundColor: colors.tint }], children: /* @__PURE__ */ jsx6(Ionicons5, { name: "desktop", size: 34, color: colors.onTint }) }),
          /* @__PURE__ */ jsx6(Text5, { style: [styles5.title, { color: colors.text }], accessibilityRole: "header", children: "Willkommen bei Deskview" }),
          /* @__PURE__ */ jsx6(Text5, { style: [styles5.subtitle, { color: colors.textSecondary }], children: "Sieh jede Website wie auf einem echten Monitor – und bediene sie wie mit einer Maus." }),
          POINTS.map((p) => /* @__PURE__ */ jsxs5(View5, { style: styles5.point, children: [
            /* @__PURE__ */ jsx6(Ionicons5, { name: p.icon, size: 30, color: colors.tint, style: styles5.pointIcon }),
            /* @__PURE__ */ jsxs5(View5, { style: styles5.pointText, children: [
              /* @__PURE__ */ jsx6(Text5, { style: [styles5.pointTitle, { color: colors.text }], children: p.title }),
              /* @__PURE__ */ jsx6(Text5, { style: [styles5.pointBody, { color: colors.textSecondary }], children: p.text })
            ] })
          ] }, p.title)),
          /* @__PURE__ */ jsx6(Text5, { style: [styles5.note, { color: colors.textSecondary }], children: "Zum Start öffnet sich eine Testseite. Sie zeigt dir sofort, wie groß der Bildschirm für die Website ist." })
        ] }),
        /* @__PURE__ */ jsx6(View5, { style: styles5.footer, children: /* @__PURE__ */ jsx6(
          Pressable5,
          {
            onPress: onDone,
            accessibilityRole: "button",
            style: ({ pressed }) => [styles5.button, { backgroundColor: colors.tint }, pressed ? { opacity: 0.85 } : null],
            children: /* @__PURE__ */ jsx6(Text5, { style: [styles5.buttonText, { color: colors.onTint }], children: "Los geht's" })
          }
        ) })
      ] })
    }
  );
}
var styles5 = StyleSheet5.create({
  frame: { flex: 1 },
  content: { paddingHorizontal: spacing.xl + 4, paddingTop: spacing.xxl + 8, paddingBottom: spacing.xl, alignItems: "stretch" },
  logo: {
    width: 68,
    height: 68,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: spacing.lg
  },
  title: { fontSize: fontSize.largeTitle, fontWeight: "800", textAlign: "center" },
  subtitle: { fontSize: fontSize.body - 1, textAlign: "center", marginTop: spacing.sm, marginBottom: spacing.xxl, lineHeight: 22 },
  point: { flexDirection: "row", marginBottom: spacing.xl, maxWidth: 520, alignSelf: "center" },
  pointIcon: { width: 44, marginRight: spacing.md, marginTop: 2 },
  pointText: { flex: 1 },
  pointTitle: { fontSize: fontSize.body, fontWeight: "700", marginBottom: 2 },
  pointBody: { fontSize: fontSize.subhead, lineHeight: 21 },
  note: { fontSize: fontSize.footnote, textAlign: "center", lineHeight: 18, marginTop: spacing.sm },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg, paddingTop: spacing.sm },
  button: { height: HIT + 8, borderRadius: radius.lg, alignItems: "center", justifyContent: "center", maxWidth: 520, width: "100%", alignSelf: "center" },
  buttonText: { fontSize: fontSize.body, fontWeight: "700" }
});

// src/ui/ResolutionSheet.tsx
import { Ionicons as Ionicons6 } from "@expo/vector-icons";
import { useCallback as useCallback3, useEffect as useEffect2, useMemo as useMemo2, useState as useState3 } from "react";
import { Pressable as Pressable6, StyleSheet as StyleSheet6, Text as Text6, TextInput as TextInput2, View as View6 } from "react-native";
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
var LARGE_WIDTH = 3840;
var MEMORY_HINT = "Braucht viel Arbeitsspeicher";
var SCALE_MODE_TEXT = {
  fill: {
    label: "Ganzer Bildschirm",
    explain: "Breite wie gewählt, die Höhe passt sich deinem iPhone an – ohne Ränder. Screenshots sind dann höher als der echte Monitor; für exakte Belege „Originalformat“ wählen."
  },
  exact: {
    label: "Originalformat",
    explain: "Breite und Höhe genau wie gewählt – dafür mit Rändern."
  }
};
function ModeSchematic({ mode, active }) {
  const { colors } = useTheme();
  const stroke = active ? colors.tint : colors.textSecondary;
  return /* @__PURE__ */ jsx7(View6, { style: [schematic.phone, { borderColor: stroke }], children: mode === "fill" ? /* @__PURE__ */ jsx7(View6, { style: [schematic.fill, { backgroundColor: stroke, opacity: 0.35 }] }) : /* @__PURE__ */ jsx7(View6, { style: [schematic.exact, { backgroundColor: stroke, opacity: 0.35 }] }) });
}
function ResolutionSheet({
  visible,
  onClose,
  resolution,
  scaleMode,
  host,
  profileActive,
  onSelectResolution,
  onSelectScaleMode,
  onToggleProfile
}) {
  const { colors } = useTheme();
  const [widthText, setWidthText] = useState3(String(resolution.width));
  const [heightText, setHeightText] = useState3(String(resolution.height));
  const [customNote, setCustomNote] = useState3(null);
  useEffect2(() => {
    if (!visible) return;
    setWidthText(String(resolution.width));
    setHeightText(String(resolution.height));
    setCustomNote(null);
  }, [visible]);
  const groups = useMemo2(() => {
    const order = Object.keys(PRESET_GROUP_LABELS);
    return order.map((g) => ({ group: g, label: PRESET_GROUP_LABELS[g], presets: PRESETS.filter((p) => p.group === g) })).filter((g) => g.presets.length > 0);
  }, []);
  const current = findPreset(resolution);
  const applyCustom = useCallback3(() => {
    const w = parseInt(widthText.replace(/\D/g, ""), 10);
    const h = parseInt(heightText.replace(/\D/g, ""), 10);
    if (!isFinite(w) || !isFinite(h)) {
      setCustomNote("Bitte Breite und Höhe als Zahl eingeben.");
      return;
    }
    const r = clampResolution({ width: w, height: h });
    setWidthText(String(r.width));
    setHeightText(String(r.height));
    setCustomNote(
      r.width !== w || r.height !== h ? `Angepasst auf ${formatResolution(r)} (erlaubter Bereich).` : `${formatResolution(r)} übernommen.`
    );
    onSelectResolution(r);
  }, [widthText, heightText, onSelectResolution]);
  const customWidth = parseInt(widthText, 10);
  const selectPreset = useCallback3((p) => onSelectResolution({ width: p.width, height: p.height }), [onSelectResolution]);
  return /* @__PURE__ */ jsxs6(Sheet, { visible, title: "Bildschirmgröße", onClose, children: [
    /* @__PURE__ */ jsxs6(Text6, { style: [styles6.current, { color: colors.textSecondary }], children: [
      "Aktuell: ",
      /* @__PURE__ */ jsx7(Text6, { style: { color: colors.text, fontWeight: "600" }, children: current ? current.label : "Eigene Größe" }),
      " · ",
      formatResolution(resolution),
      profileActive && host ? ` · gemerkt für ${host}` : ""
    ] }),
    groups.map((g) => /* @__PURE__ */ jsx7(Section, { title: g.label, children: g.presets.map((p, i) => {
      const selected = p.width === resolution.width && p.height === resolution.height;
      const big = p.width >= LARGE_WIDTH;
      return /* @__PURE__ */ jsxs6(View6, { children: [
        i > 0 ? /* @__PURE__ */ jsx7(Separator, {}) : null,
        /* @__PURE__ */ jsx7(
          Row,
          {
            title: p.label,
            subtitle: `${formatResolution(p)}  ·  ${p.detail}${big ? `
${MEMORY_HINT}` : ""}`,
            checked: selected,
            onPress: () => {
              selectPreset(p);
              onClose();
            },
            accessibilityLabel: `${p.label}, ${p.width} mal ${p.height} Pixel, ${p.detail}${big ? `, ${MEMORY_HINT}` : ""}`
          }
        )
      ] }, p.id);
    }) }, g.group)),
    /* @__PURE__ */ jsx7(Section, { title: "Darstellung", footer: SCALE_MODE_TEXT[scaleMode].explain, children: /* @__PURE__ */ jsx7(View6, { style: styles6.segmentWrap, children: /* @__PURE__ */ jsx7(View6, { style: [styles6.segment, { backgroundColor: colors.fieldBackground }], accessibilityRole: "radiogroup", children: ["fill", "exact"].map((m) => {
      const active = m === scaleMode;
      return /* @__PURE__ */ jsxs6(
        Pressable6,
        {
          onPress: () => onSelectScaleMode(m),
          accessibilityRole: "radio",
          accessibilityState: { checked: active },
          accessibilityLabel: SCALE_MODE_TEXT[m].label,
          accessibilityHint: SCALE_MODE_TEXT[m].explain,
          style: [styles6.segmentItem, active ? [styles6.segmentActive, { backgroundColor: colors.surfaceElevated }] : null],
          children: [
            /* @__PURE__ */ jsx7(ModeSchematic, { mode: m, active }),
            /* @__PURE__ */ jsx7(Text6, { style: [styles6.segmentText, { color: active ? colors.text : colors.textSecondary }], children: SCALE_MODE_TEXT[m].label })
          ]
        },
        m
      );
    }) }) }) }),
    /* @__PURE__ */ jsx7(
      Section,
      {
        footer: host ? profileActive ? `Gilt nur für ${host}. Beim nächsten Besuch wird diese Größe automatisch eingestellt.` : `Größe und Darstellung werden für ${host} gespeichert und dort automatisch verwendet.` : "Öffne eine Website, um dir die Größe für sie zu merken. Auf der Testseite geht das nicht.",
        children: /* @__PURE__ */ jsx7(
          SwitchRow,
          {
            title: host ? `Für ${host} merken` : "Für diese Website merken",
            value: profileActive,
            onValueChange: onToggleProfile,
            disabled: !host
          }
        )
      }
    ),
    /* @__PURE__ */ jsx7(
      Section,
      {
        title: "Erweitert – eigene Größe",
        footer: `Erlaubt: Breite ${MIN_WIDTH}–${MAX_WIDTH} px, Höhe ${MIN_HEIGHT}–${MAX_HEIGHT} px (CSS-Pixel, entspricht window.innerWidth).`,
        children: /* @__PURE__ */ jsxs6(View6, { style: styles6.custom, children: [
          /* @__PURE__ */ jsxs6(View6, { style: styles6.inputs, children: [
            /* @__PURE__ */ jsxs6(View6, { style: styles6.inputBox, children: [
              /* @__PURE__ */ jsx7(Text6, { style: [styles6.inputLabel, { color: colors.textSecondary }], children: "Breite" }),
              /* @__PURE__ */ jsx7(
                TextInput2,
                {
                  value: widthText,
                  onChangeText: setWidthText,
                  keyboardType: "number-pad",
                  maxLength: 4,
                  returnKeyType: "done",
                  onSubmitEditing: applyCustom,
                  style: [styles6.input, { color: colors.text, backgroundColor: colors.fieldBackground }],
                  accessibilityLabel: "Breite in Pixel"
                }
              )
            ] }),
            /* @__PURE__ */ jsx7(Text6, { style: [styles6.times, { color: colors.textSecondary }], children: "×" }),
            /* @__PURE__ */ jsxs6(View6, { style: styles6.inputBox, children: [
              /* @__PURE__ */ jsx7(Text6, { style: [styles6.inputLabel, { color: colors.textSecondary }], children: "Höhe" }),
              /* @__PURE__ */ jsx7(
                TextInput2,
                {
                  value: heightText,
                  onChangeText: setHeightText,
                  keyboardType: "number-pad",
                  maxLength: 4,
                  returnKeyType: "done",
                  onSubmitEditing: applyCustom,
                  style: [styles6.input, { color: colors.text, backgroundColor: colors.fieldBackground }],
                  accessibilityLabel: "Höhe in Pixel"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx7(
            Pressable6,
            {
              onPress: applyCustom,
              accessibilityRole: "button",
              style: ({ pressed }) => [styles6.apply, { backgroundColor: colors.tint }, pressed ? { opacity: 0.85 } : null],
              children: /* @__PURE__ */ jsx7(Text6, { style: [styles6.applyText, { color: colors.onTint }], children: "Übernehmen" })
            }
          ),
          customWidth >= LARGE_WIDTH ? /* @__PURE__ */ jsxs6(View6, { style: styles6.warning, children: [
            /* @__PURE__ */ jsx7(Ionicons6, { name: "warning-outline", size: 16, color: colors.warning }),
            /* @__PURE__ */ jsxs6(Text6, { style: [styles6.note, { color: colors.warning }], children: [
              MEMORY_HINT,
              " – bei sehr großen Seiten kann die Darstellung ruckeln."
            ] })
          ] }) : null,
          customNote ? /* @__PURE__ */ jsx7(Text6, { style: [styles6.note, { color: colors.textSecondary }], children: customNote }) : null
        ] })
      }
    )
  ] });
}
var schematic = StyleSheet6.create({
  phone: {
    width: 26,
    height: 42,
    borderWidth: 1.5,
    borderRadius: 5,
    padding: 2,
    justifyContent: "center",
    marginBottom: spacing.xs + 2
  },
  fill: { flex: 1, borderRadius: 2 },
  exact: { height: 12, borderRadius: 1 }
});
var styles6 = StyleSheet6.create({
  current: { fontSize: fontSize.footnote, marginHorizontal: spacing.lg, marginBottom: spacing.lg, lineHeight: 18 },
  segmentWrap: { padding: spacing.md },
  segment: { flexDirection: "row", borderRadius: radius.md, padding: 3 },
  segmentItem: { flex: 1, alignItems: "center", paddingVertical: spacing.sm + 2, borderRadius: radius.sm + 2, minHeight: HIT },
  segmentActive: {
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2
  },
  segmentText: { fontSize: fontSize.subhead - 1, fontWeight: "600" },
  custom: { padding: spacing.lg, gap: spacing.md },
  inputs: { flexDirection: "row", alignItems: "flex-end", gap: spacing.sm },
  inputBox: { flex: 1 },
  inputLabel: { fontSize: fontSize.caption, marginBottom: 4 },
  input: {
    height: HIT,
    borderRadius: radius.sm + 2,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.body,
    fontVariant: ["tabular-nums"]
  },
  times: { fontSize: fontSize.title, paddingBottom: 10 },
  apply: { height: HIT, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  applyText: { fontSize: fontSize.body, fontWeight: "600" },
  warning: { flexDirection: "row", alignItems: "center", gap: spacing.xs + 2 },
  note: { fontSize: fontSize.footnote, flexShrink: 1 }
});

// src/ui/SettingsSheet.tsx
import { Ionicons as Ionicons7 } from "@expo/vector-icons";
import { useCallback as useCallback4, useEffect as useEffect3, useMemo as useMemo3, useState as useState4 } from "react";
import { LayoutAnimation, Pressable as Pressable7, StyleSheet as StyleSheet7, Text as Text7, TextInput as TextInput3, View as View7 } from "react-native";
import { jsx as jsx8, jsxs as jsxs7 } from "react/jsx-runtime";
var APP_VERSION = "1.0.0";
var DESKTOP_CHANGES = [
  { title: "Bildschirmgröße", detail: "screen.width/height und outerWidth/Height entsprechen der gewählten Größe" },
  { title: "Plattform", detail: "navigator.platform und vendor passend zur Browser-Kennung (z. B. MacIntel)" },
  { title: "Keine Touch-Erkennung", detail: "navigator.maxTouchPoints = 0, kein ontouchstart" },
  { title: "Maus als Zeigegerät", detail: "Media Queries (hover: hover) und (pointer: fine) treffen zu" },
  { title: "Viewport-Tag ignoriert", detail: '<meta name="viewport"> wird wie im Desktop-Browser nicht beachtet' }
];
var AGENT_FOOTER = "Alle Browser auf dem iPhone nutzen die Safari-Engine (WebKit). Die Kennung ändert nur, wie sich die App gegenüber Websites ausgibt – Darstellungsfehler, die nur Chrome hat, lassen sich hier nicht nachstellen.";
function describeProfile(p) {
  const preset = findPreset(p.resolution);
  const mode = p.scaleMode === "fill" ? "Ganzer Bildschirm" : "Originalformat";
  return `${preset ? `${preset.label} · ` : ""}${formatResolution(p.resolution)} · ${mode}`;
}
function SettingsSheet({ visible, onClose, currentUrl, onOpenUrl, onCopyPageInfo, onShowIntro }) {
  const { colors } = useTheme();
  const { settings, updateSettings, siteProfiles, setSiteProfile } = useAppState();
  const [showDetails, setShowDetails] = useState4(false);
  const [customHome, setCustomHome] = useState4(settings.homeUrl !== TEST_PAGE_URL);
  const [homeText, setHomeText] = useState4(settings.homeUrl === TEST_PAGE_URL ? "" : settings.homeUrl);
  const [homeNote, setHomeNote] = useState4(null);
  useEffect3(() => {
    if (!visible) return;
    const custom = settings.homeUrl !== TEST_PAGE_URL;
    setCustomHome(custom);
    setHomeText(custom ? settings.homeUrl : "");
    setHomeNote(null);
  }, [visible]);
  const profiles = useMemo3(
    () => Object.values(siteProfiles).sort((a, b) => a.host.localeCompare(b.host)),
    [siteProfiles]
  );
  const toggleDetails = useCallback4(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowDetails((v) => !v);
  }, []);
  const saveHome = useCallback4(
    (input) => {
      const url = resolveInput(input.trim(), settings.searchEngine);
      if (!url) {
        setHomeNote("Bitte eine Adresse eingeben.");
        return;
      }
      setHomeText(url);
      setHomeNote("Gespeichert.");
      updateSettings({ homeUrl: url });
    },
    [settings.searchEngine, updateSettings]
  );
  const chooseTestHome = useCallback4(() => {
    setCustomHome(false);
    setHomeNote(null);
    updateSettings({ homeUrl: TEST_PAGE_URL });
  }, [updateSettings]);
  const openTestPage = useCallback4(() => {
    onOpenUrl(TEST_PAGE_URL);
    onClose();
  }, [onOpenUrl, onClose]);
  const canUseCurrent = !!currentUrl && currentUrl !== TEST_PAGE_URL;
  return /* @__PURE__ */ jsxs7(Sheet, { visible, title: "Einstellungen", onClose, children: [
    /* @__PURE__ */ jsx8(Section, { title: "Als Browser ausgeben", footer: AGENT_FOOTER, children: AGENTS.map((a, i) => /* @__PURE__ */ jsxs7(View7, { children: [
      i > 0 ? /* @__PURE__ */ jsx8(Separator, {}) : null,
      /* @__PURE__ */ jsx8(Row, { title: a.label, checked: a.id === settings.agentId, onPress: () => updateSettings({ agentId: a.id }) })
    ] }, a.id)) }),
    /* @__PURE__ */ jsxs7(
      Section,
      {
        footer: settings.desktopMode ? "Websites halten dein iPhone für einen Computer mit Maus." : "Aus: Websites erkennen, dass ein Touch-Gerät verwendet wird.",
        children: [
          /* @__PURE__ */ jsx8(
            SwitchRow,
            {
              title: "Desktop-Modus",
              subtitle: "Website verhält sich wie auf einem Computer",
              value: settings.desktopMode,
              onValueChange: (v) => updateSettings({ desktopMode: v })
            }
          ),
          /* @__PURE__ */ jsx8(Separator, {}),
          /* @__PURE__ */ jsx8(
            Row,
            {
              title: "Was wird geändert?",
              onPress: toggleDetails,
              right: /* @__PURE__ */ jsx8(Ionicons7, { name: showDetails ? "chevron-up" : "chevron-down", size: 18, color: colors.textSecondary }),
              accessibilityLabel: showDetails ? "Details ausblenden" : "Was wird geändert? Details anzeigen"
            }
          ),
          showDetails ? /* @__PURE__ */ jsx8(View7, { style: styles7.details, children: DESKTOP_CHANGES.map((c) => /* @__PURE__ */ jsxs7(View7, { style: styles7.detailRow, children: [
            /* @__PURE__ */ jsx8(Ionicons7, { name: "checkmark-circle", size: 18, color: colors.success, style: styles7.detailIcon }),
            /* @__PURE__ */ jsxs7(View7, { style: styles7.detailText, children: [
              /* @__PURE__ */ jsx8(Text7, { style: [styles7.detailTitle, { color: colors.text }], children: c.title }),
              /* @__PURE__ */ jsx8(Text7, { style: [styles7.detailSub, { color: colors.textSecondary }], children: c.detail })
            ] })
          ] }, c.title)) }) : null
        ]
      }
    ),
    /* @__PURE__ */ jsx8(Section, { title: "Suchmaschine", children: SEARCH_ENGINES.map((e, i) => /* @__PURE__ */ jsxs7(View7, { children: [
      i > 0 ? /* @__PURE__ */ jsx8(Separator, {}) : null,
      /* @__PURE__ */ jsx8(Row, { title: e.label, checked: e.id === settings.searchEngine, onPress: () => updateSettings({ searchEngine: e.id }) })
    ] }, e.id)) }),
    /* @__PURE__ */ jsxs7(Section, { title: "Startseite", footer: homeNote ?? void 0, children: [
      /* @__PURE__ */ jsx8(
        Row,
        {
          title: "Testseite",
          subtitle: "Zeigt Bildschirmgröße, Breakpoints und Maus-Erkennung",
          checked: !customHome,
          onPress: chooseTestHome
        }
      ),
      /* @__PURE__ */ jsx8(Separator, {}),
      /* @__PURE__ */ jsx8(Row, { title: "Eigene Adresse", checked: customHome, onPress: () => setCustomHome(true) }),
      customHome ? /* @__PURE__ */ jsxs7(View7, { style: styles7.homeBox, children: [
        /* @__PURE__ */ jsx8(
          TextInput3,
          {
            value: homeText,
            onChangeText: setHomeText,
            onSubmitEditing: () => saveHome(homeText),
            placeholder: "z. B. example.com",
            placeholderTextColor: colors.textTertiary,
            autoCapitalize: "none",
            autoCorrect: false,
            keyboardType: "url",
            returnKeyType: "done",
            style: [styles7.input, { color: colors.text, backgroundColor: colors.fieldBackground }],
            accessibilityLabel: "Adresse der Startseite"
          }
        ),
        /* @__PURE__ */ jsxs7(View7, { style: styles7.homeButtons, children: [
          /* @__PURE__ */ jsx8(
            Pressable7,
            {
              onPress: () => saveHome(homeText),
              accessibilityRole: "button",
              style: [styles7.smallButton, { backgroundColor: colors.tint }],
              children: /* @__PURE__ */ jsx8(Text7, { style: [styles7.smallButtonText, { color: colors.onTint }], children: "Speichern" })
            }
          ),
          canUseCurrent ? /* @__PURE__ */ jsx8(
            Pressable7,
            {
              onPress: () => saveHome(currentUrl),
              accessibilityRole: "button",
              style: [styles7.smallButton, { backgroundColor: colors.fieldBackground }],
              children: /* @__PURE__ */ jsx8(Text7, { style: [styles7.smallButtonText, { color: colors.text }], children: "Aktuelle Seite" })
            }
          ) : null
        ] })
      ] }) : null
    ] }),
    /* @__PURE__ */ jsxs7(Section, { title: "Screenshot", footer: "Unter dem Screenshot stehen dann Adresse, Bildschirmgröße, Browser-Kennung und Uhrzeit.", children: [
      /* @__PURE__ */ jsx8(
        SwitchRow,
        {
          title: "Info-Leiste im Screenshot",
          value: settings.screenshotInfoBar,
          onValueChange: (v) => updateSettings({ screenshotInfoBar: v })
        }
      ),
      /* @__PURE__ */ jsx8(Separator, {}),
      /* @__PURE__ */ jsx8(
        Row,
        {
          icon: "copy-outline",
          title: "Seiteninfo kopieren",
          subtitle: "Adresse, Größe, Kennung und Uhrzeit als Text",
          onPress: onCopyPageInfo
        }
      )
    ] }),
    /* @__PURE__ */ jsx8(
      Section,
      {
        title: "Website-Profile",
        footer: profiles.length === 0 ? "Noch keine. Tippe oben auf die Größenanzeige und wähle „Für … merken“, damit eine Website immer in derselben Größe öffnet." : "Diese Websites öffnen automatisch in der gespeicherten Größe.",
        children: profiles.length === 0 ? /* @__PURE__ */ jsx8(Row, { title: "Keine Website-Profile", disabled: true }) : profiles.map((p, i) => /* @__PURE__ */ jsxs7(View7, { children: [
          i > 0 ? /* @__PURE__ */ jsx8(Separator, {}) : null,
          /* @__PURE__ */ jsx8(
            Row,
            {
              title: p.host,
              subtitle: describeProfile(p),
              right: /* @__PURE__ */ jsx8(
                Pressable7,
                {
                  onPress: () => setSiteProfile(p.host, null),
                  hitSlop: 6,
                  style: styles7.trash,
                  accessibilityRole: "button",
                  accessibilityLabel: `Profil für ${p.host} löschen`,
                  children: /* @__PURE__ */ jsx8(Ionicons7, { name: "trash-outline", size: 20, color: colors.danger })
                }
              )
            }
          )
        ] }, p.host))
      }
    ),
    /* @__PURE__ */ jsxs7(Section, { children: [
      /* @__PURE__ */ jsx8(Row, { icon: "speedometer-outline", title: "Testseite öffnen", onPress: openTestPage }),
      /* @__PURE__ */ jsx8(Separator, {}),
      /* @__PURE__ */ jsx8(
        Row,
        {
          icon: "sparkles-outline",
          title: "Einführung erneut zeigen",
          onPress: () => {
            onClose();
            onShowIntro();
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs7(Text7, { style: [styles7.about, { color: colors.textSecondary }], children: [
      "Deskview ",
      APP_VERSION,
      "\n",
      "Sieh jede Website wie auf einem echten Monitor – und bediene sie wie mit einer Maus. Logins und Cookies bleiben gespeichert."
    ] })
  ] });
}
var styles7 = StyleSheet7.create({
  details: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.md },
  detailRow: { flexDirection: "row", alignItems: "flex-start" },
  detailIcon: { marginRight: spacing.md, marginTop: 1 },
  detailText: { flex: 1 },
  detailTitle: { fontSize: fontSize.subhead, fontWeight: "600" },
  detailSub: { fontSize: fontSize.footnote, marginTop: 1, lineHeight: 17 },
  homeBox: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.sm },
  input: { height: HIT, borderRadius: radius.sm + 2, paddingHorizontal: spacing.md, fontSize: fontSize.body },
  homeButtons: { flexDirection: "row", gap: spacing.sm },
  smallButton: { height: HIT - 6, paddingHorizontal: spacing.lg, borderRadius: radius.md, justifyContent: "center" },
  smallButtonText: { fontSize: fontSize.subhead, fontWeight: "600" },
  trash: { width: HIT, height: HIT, alignItems: "center", justifyContent: "center", marginRight: -spacing.sm },
  about: { fontSize: fontSize.footnote, textAlign: "center", lineHeight: 18, marginHorizontal: spacing.lg }
});

// src/ui/SizeChip.tsx
import { Ionicons as Ionicons8 } from "@expo/vector-icons";
import { memo as memo2, useEffect as useEffect4, useRef as useRef3, useState as useState5 } from "react";
import { Animated, Pressable as Pressable8, StyleSheet as StyleSheet8, Text as Text8 } from "react-native";
import { jsx as jsx9, jsxs as jsxs8 } from "react/jsx-runtime";
var HIDE_AFTER_MS = 2e3;
function SizeChipImpl({ label, sizeText, profileActive, autoHide, onPress }) {
  const { colors } = useTheme();
  const opacity = useRef3(new Animated.Value(1)).current;
  const [hidden, setHidden] = useState5(false);
  useEffect4(() => {
    setHidden(false);
    opacity.stopAnimation();
    opacity.setValue(1);
    if (!autoHide) return;
    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }).start(({ finished }) => {
        if (finished) setHidden(true);
      });
    }, HIDE_AFTER_MS);
    return () => clearTimeout(timer);
  }, [autoHide, sizeText, label, opacity]);
  return /* @__PURE__ */ jsx9(Animated.View, { style: [styles8.wrap, { opacity }], pointerEvents: hidden ? "none" : "box-none", children: /* @__PURE__ */ jsxs8(
    Pressable8,
    {
      onPress,
      hitSlop: 10,
      accessibilityRole: "button",
      accessibilityLabel: `Bildschirmgröße: ${label}, ${sizeText}${profileActive ? ", für diese Website gemerkt" : ""}`,
      accessibilityHint: "Öffnet die Schnellwahl für die Bildschirmgröße",
      style: ({ pressed }) => [styles8.chip, { backgroundColor: colors.chipBackground }, pressed ? styles8.pressed : null],
      children: [
        profileActive ? /* @__PURE__ */ jsx9(Ionicons8, { name: "bookmark", size: 11, color: colors.chipText, style: styles8.icon }) : null,
        /* @__PURE__ */ jsx9(Text8, { style: [styles8.label, { color: colors.chipText }], numberOfLines: 1, children: label }),
        /* @__PURE__ */ jsx9(Text8, { style: [styles8.size, { color: colors.chipText }], numberOfLines: 1, children: sizeText }),
        /* @__PURE__ */ jsx9(Ionicons8, { name: "chevron-down", size: 12, color: colors.chipText, style: styles8.icon })
      ]
    }
  ) });
}
var SizeChip = memo2(SizeChipImpl);
var styles8 = StyleSheet8.create({
  wrap: { position: "absolute", top: spacing.sm, left: 0, right: 0, alignItems: "center" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    maxWidth: "92%",
    gap: spacing.xs + 2
  },
  pressed: { opacity: 0.7 },
  icon: { opacity: 0.85 },
  label: { fontSize: fontSize.footnote, fontWeight: "600", flexShrink: 1 },
  size: { fontSize: fontSize.footnote, opacity: 0.8, fontVariant: ["tabular-nums"] }
});

// src/ui/Toast.tsx
import { useEffect as useEffect5, useRef as useRef4 } from "react";
import { Animated as Animated2, Pressable as Pressable9, StyleSheet as StyleSheet9, Text as Text9 } from "react-native";
import { jsx as jsx10, jsxs as jsxs9 } from "react/jsx-runtime";
function Toast({ toast, onHide }) {
  const { colors } = useTheme();
  const opacity = useRef4(new Animated2.Value(0)).current;
  useEffect5(() => {
    if (!toast) return;
    opacity.setValue(0);
    Animated2.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    const ms = toast.duration ?? (toast.action ? 5e3 : 2600);
    const timer = setTimeout(() => {
      Animated2.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => onHide());
    }, ms);
    return () => clearTimeout(timer);
  }, [toast, opacity, onHide]);
  if (!toast) return null;
  return /* @__PURE__ */ jsxs9(
    Animated2.View,
    {
      style: [styles9.toast, { opacity, backgroundColor: colors.chipBackground }],
      accessibilityLiveRegion: "polite",
      accessibilityRole: "alert",
      children: [
        /* @__PURE__ */ jsx10(Text9, { style: [styles9.text, { color: colors.chipText }], children: toast.message }),
        toast.action ? /* @__PURE__ */ jsx10(
          Pressable9,
          {
            onPress: () => {
              toast.action?.onPress();
              onHide();
            },
            hitSlop: 10,
            accessibilityRole: "button",
            style: styles9.action,
            children: /* @__PURE__ */ jsx10(Text9, { style: [styles9.actionText, { color: "#64D2FF" }], children: toast.action.label })
          }
        ) : null
      ]
    }
  );
}
var styles9 = StyleSheet9.create({
  toast: {
    position: "absolute",
    bottom: spacing.lg,
    alignSelf: "center",
    maxWidth: "92%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md - 2,
    borderRadius: radius.pill,
    gap: spacing.md
  },
  text: { fontSize: fontSize.subhead, flexShrink: 1 },
  action: { paddingVertical: 2 },
  actionText: { fontSize: fontSize.subhead, fontWeight: "700" }
});

// src/ui/Toolbar.tsx
import { Ionicons as Ionicons9 } from "@expo/vector-icons";
import { memo as memo3 } from "react";
import { Pressable as Pressable10, StyleSheet as StyleSheet10, Text as Text10, View as View8 } from "react-native";
import { jsx as jsx11, jsxs as jsxs10 } from "react/jsx-runtime";
function ToolButton({
  icon,
  label,
  onPress,
  disabled
}) {
  const { colors } = useTheme();
  return /* @__PURE__ */ jsx11(
    Pressable10,
    {
      onPress,
      disabled,
      hitSlop: 4,
      accessibilityRole: "button",
      accessibilityLabel: label,
      accessibilityState: { disabled: !!disabled },
      style: ({ pressed }) => [styles10.button, pressed ? styles10.pressed : null],
      children: /* @__PURE__ */ jsx11(Ionicons9, { name: icon, size: 24, color: disabled ? colors.textTertiary : colors.tint })
    }
  );
}
function ToolbarImpl(p) {
  const { colors } = useTheme();
  const mouse2 = p.inputMode === "mouse";
  return /* @__PURE__ */ jsxs10(View8, { style: [styles10.bar, { backgroundColor: colors.chrome, borderTopColor: colors.separator }], children: [
    /* @__PURE__ */ jsx11(ToolButton, { icon: "chevron-back", label: "Zurück", onPress: p.onBack, disabled: !p.canGoBack }),
    /* @__PURE__ */ jsx11(ToolButton, { icon: "chevron-forward", label: "Vor", onPress: p.onForward, disabled: !p.canGoForward }),
    /* @__PURE__ */ jsxs10(
      Pressable10,
      {
        onPress: p.onToggleMouse,
        hitSlop: 6,
        accessibilityRole: "switch",
        accessibilityLabel: "Maus-Modus",
        accessibilityHint: "Steuert die Seite wie mit einem Trackpad und Mauszeiger",
        accessibilityState: { checked: mouse2 },
        style: ({ pressed }) => [
          styles10.mouse,
          { backgroundColor: mouse2 ? colors.tint : colors.tintSoft },
          pressed ? styles10.pressed : null
        ],
        children: [
          /* @__PURE__ */ jsx11(Ionicons9, { name: mouse2 ? "navigate" : "navigate-outline", size: 18, color: mouse2 ? colors.onTint : colors.tint, style: styles10.mouseIcon }),
          /* @__PURE__ */ jsx11(Text10, { style: [styles10.mouseLabel, { color: mouse2 ? colors.onTint : colors.tint }], children: "Maus" })
        ]
      }
    ),
    /* @__PURE__ */ jsx11(ToolButton, { icon: "camera-outline", label: "Screenshot", onPress: p.onScreenshot, disabled: p.capturing }),
    /* @__PURE__ */ jsx11(ToolButton, { icon: "book-outline", label: "Lesezeichen", onPress: p.onBookmarks }),
    /* @__PURE__ */ jsx11(ToolButton, { icon: "expand-outline", label: "Vollbild", onPress: p.onFullscreen }),
    /* @__PURE__ */ jsx11(ToolButton, { icon: "ellipsis-horizontal-circle-outline", label: "Mehr", onPress: p.onMore })
  ] });
}
var Toolbar = memo3(ToolbarImpl);
var styles10 = StyleSheet10.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet10.hairlineWidth,
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.xs
  },
  button: { minWidth: HIT, height: HIT, alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.5 },
  mouse: {
    height: 34,
    minWidth: 72,
    marginVertical: (HIT - 34) / 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  mouseIcon: { transform: [{ rotate: "-90deg" }], marginRight: spacing.xs },
  mouseLabel: { fontSize: fontSize.subhead, fontWeight: "600" }
});

// src/ui/TrackpadHint.tsx
import { Ionicons as Ionicons10 } from "@expo/vector-icons";
import { Pressable as Pressable11, StyleSheet as StyleSheet11, Text as Text11, View as View9 } from "react-native";
import { jsx as jsx12, jsxs as jsxs11 } from "react/jsx-runtime";
var GESTURES = [
  { icon: "finger-print-outline", gesture: "1 Finger bewegen", effect: "Maus bewegen" },
  { icon: "radio-button-on-outline", gesture: "Tippen", effect: "Klicken (dort, wo der Zeiger ist)" },
  { icon: "time-outline", gesture: "Lange drücken", effect: "Rechtsklick" },
  { icon: "swap-vertical-outline", gesture: "2 Finger", effect: "Scrollen" }
];
function TrackpadHint({ onDismiss }) {
  const { colors } = useTheme();
  return /* @__PURE__ */ jsx12(View9, { style: [styles11.backdrop, { backgroundColor: colors.overlay }], accessibilityViewIsModal: true, children: /* @__PURE__ */ jsxs11(View9, { style: [styles11.card, { backgroundColor: colors.surfaceElevated }], children: [
    /* @__PURE__ */ jsx12(Text11, { style: [styles11.title, { color: colors.text }], accessibilityRole: "header", children: "Maus-Modus ist an" }),
    /* @__PURE__ */ jsx12(Text11, { style: [styles11.lead, { color: colors.textSecondary }], children: "Dein Bildschirm wird zum Trackpad. So klappen auch Menüs auf, die nur bei Mausberührung erscheinen." }),
    GESTURES.map((g) => /* @__PURE__ */ jsxs11(View9, { style: styles11.row, children: [
      /* @__PURE__ */ jsx12(View9, { style: [styles11.iconWrap, { backgroundColor: colors.tintSoft }], children: /* @__PURE__ */ jsx12(Ionicons10, { name: g.icon, size: 20, color: colors.tint }) }),
      /* @__PURE__ */ jsx12(Text11, { style: [styles11.gesture, { color: colors.text }], children: g.gesture }),
      /* @__PURE__ */ jsxs11(Text11, { style: [styles11.effect, { color: colors.textSecondary }], children: [
        "= ",
        g.effect
      ] })
    ] }, g.gesture)),
    /* @__PURE__ */ jsx12(
      Pressable11,
      {
        onPress: onDismiss,
        accessibilityRole: "button",
        style: ({ pressed }) => [styles11.button, { backgroundColor: colors.tint }, pressed ? { opacity: 0.8 } : null],
        children: /* @__PURE__ */ jsx12(Text11, { style: [styles11.buttonText, { color: colors.onTint }], children: "Verstanden" })
      }
    )
  ] }) });
}
var styles11 = StyleSheet11.create({
  backdrop: { ...StyleSheet11.absoluteFill, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  card: { width: "100%", maxWidth: 380, borderRadius: radius.xl, padding: spacing.xl },
  title: { fontSize: fontSize.title, fontWeight: "700", marginBottom: spacing.sm },
  lead: { fontSize: fontSize.subhead, lineHeight: 21, marginBottom: spacing.lg },
  row: { flexDirection: "row", alignItems: "center", marginBottom: spacing.md, gap: spacing.md },
  iconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  gesture: { fontSize: fontSize.body - 1, fontWeight: "600" },
  effect: { fontSize: fontSize.body - 1, flexShrink: 1 },
  button: { marginTop: spacing.md, height: HIT + 6, borderRadius: radius.lg, alignItems: "center", justifyContent: "center" },
  buttonText: { fontSize: fontSize.body, fontWeight: "600" }
});

// src/viewport/DesktopViewport.tsx
import { forwardRef, useCallback as useCallback5, useEffect as useEffect7, useImperativeHandle, useMemo as useMemo5, useRef as useRef6, useState as useState6 } from "react";
import { Linking, PixelRatio, StyleSheet as StyleSheet14, View as View12 } from "react-native";
import { captureRef } from "react-native-view-shot";
import { WebView } from "react-native-webview";

// src/core/injected/shared.ts
function iife(body) {
  return `(function(){try{
${body}
}catch(__dvErr){}})();
`;
}
var IS_TOP_JS = `var isTop = true; try { isTop = window.self === window.top; } catch (e) { isTop = false; }`;
var MQ_TRUE = "(min-width: 0px)";
var MQ_FALSE = "(max-width: 0px) and (min-width: 1px)";
var REWRITE_MEDIA_JS = `
function dvRewriteMedia(q) {
  if (typeof q !== 'string' || q.indexOf('hover') < 0 && q.indexOf('pointer') < 0) return q;
  var T = ${JSON.stringify(MQ_TRUE)}, F = ${JSON.stringify(MQ_FALSE)};
  return q
    .replace(/\\(\\s*(any-)?pointer\\s*:\\s*fine\\s*\\)/gi, T)
    .replace(/\\(\\s*(any-)?pointer\\s*:\\s*(coarse|none)\\s*\\)/gi, F)
    .replace(/\\(\\s*(any-)?hover\\s*:\\s*hover\\s*\\)/gi, T)
    .replace(/\\(\\s*(any-)?hover\\s*:\\s*none\\s*\\)/gi, F)
    .replace(/\\(\\s*(any-)?(hover|pointer)\\s*\\)/gi, T);
}
`;
var POST_JS = `
function dvPost(msg) {
  try {
    var rn = window.ReactNativeWebView;
    if (rn && typeof rn.postMessage === 'function') rn.postMessage(JSON.stringify(msg));
  } catch (e) {}
}
`;
function jsNum(v) {
  if (typeof v !== "number" || !Number.isFinite(v)) return "0";
  const r = Math.round(v * 10) / 10;
  return String(Object.is(r, -0) ? 0 : r);
}
function jsInt(v, fallback) {
  if (typeof v !== "number" || !Number.isFinite(v) || v <= 0) return String(fallback);
  return String(Math.round(v));
}

// src/core/injected/desktopEnv.ts
function buildDesktopEnvScript(screen, agent) {
  const appVersion = agent.userAgent.replace(/^Mozilla\//, "");
  return iife(`
var W = ${jsInt(screen.width, 1920)}, H = ${jsInt(screen.height, 1080)};
if (typeof window.__dvSetScreen === 'function') { window.__dvSetScreen(W, H); return; }
var st = { w: W, h: H };
var PLATFORM = ${JSON.stringify(agent.platform)};
var VENDOR = ${JSON.stringify(agent.vendor)};
var UA = ${JSON.stringify(agent.userAgent)};
var APPVERSION = ${JSON.stringify(appVersion)};
function def(obj, prop, getter) {
  if (!obj) return;
  try { Object.defineProperty(obj, prop, { get: getter, configurable: true, enumerable: true }); } catch (e) {}
}
var screenTargets = [window.Screen && window.Screen.prototype];
try { if (window.screen && Object.prototype.hasOwnProperty.call(window.screen, 'width')) screenTargets.push(window.screen); } catch (e) {}
for (var i = 0; i < screenTargets.length; i++) {
  var S = screenTargets[i];
  def(S, 'width', function () { return st.w; });
  def(S, 'height', function () { return st.h; });
  def(S, 'availWidth', function () { return st.w; });
  def(S, 'availHeight', function () { return st.h; });
}
def(window, 'outerWidth', function () { return st.w; });
def(window, 'outerHeight', function () { return st.h; });
var NP = window.Navigator && window.Navigator.prototype;
def(NP, 'platform', function () { return PLATFORM; });
def(NP, 'vendor', function () { return VENDOR; });
def(NP, 'maxTouchPoints', function () { return 0; });
def(NP, 'userAgent', function () { return UA; });
def(NP, 'appVersion', function () { return APPVERSION; });
var touchProps = ['ontouchstart', 'ontouchmove', 'ontouchend', 'ontouchcancel'];
var touchTargets = [
  window,
  window.Window && window.Window.prototype,
  window.Document && window.Document.prototype,
  window.Element && window.Element.prototype,
  window.HTMLElement && window.HTMLElement.prototype,
  document
];
for (var t = 0; t < touchTargets.length; t++) {
  for (var p = 0; p < touchProps.length; p++) {
    try { if (touchTargets[t]) delete touchTargets[t][touchProps[p]]; } catch (e) {}
  }
}
${REWRITE_MEDIA_JS}
var origMatchMedia = window.matchMedia;
if (typeof origMatchMedia === 'function' && !origMatchMedia.__dv) {
  var wrapped = function matchMedia(query) {
    return origMatchMedia.call(window, dvRewriteMedia(String(query)));
  };
  try { Object.defineProperty(wrapped, '__dv', { value: true }); } catch (e) {}
  try { wrapped.toString = function () { return 'function matchMedia() { [native code] }'; }; } catch (e) {}
  window.matchMedia = wrapped;
}
Object.defineProperty(window, '__dvSetScreen', {
  value: function (w, h) {
    if (typeof w === 'number' && isFinite(w) && w > 0) st.w = Math.round(w);
    if (typeof h === 'number' && isFinite(h) && h > 0) st.h = Math.round(h);
  },
  enumerable: false, configurable: true, writable: true
});
`);
}

// src/core/injected/infoReporter.ts
function buildInfoReporterScript() {
  return iife(`
${IS_TOP_JS}
if (!isTop || typeof window.__dvRequestInfo === 'function') return;
${POST_JS}
function send() {
  var s = window.screen || {};
  dvPost({
    type: 'info',
    url: String(location.href),
    title: String(document.title || ''),
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    screenWidth: s.width,
    screenHeight: s.height,
    devicePixelRatio: window.devicePixelRatio || 1
  });
}
Object.defineProperty(window, '__dvRequestInfo', { value: send, enumerable: false, configurable: true, writable: true });
var timer = null;
document.addEventListener('DOMContentLoaded', send);
window.addEventListener('load', send);
window.addEventListener('resize', function () {
  if (timer) clearTimeout(timer);
  timer = setTimeout(function () { timer = null; send(); }, 150);
});
`);
}

// src/core/injected/mouseEngine.ts
var HOVER_ATTR = "data-dv-hover";
var HOVER_STYLE_ID = "__dv-hover-style";
function buildMouseEngineScript() {
  return iife(`
${IS_TOP_JS}
if (!isTop || window.__dv) return;
${POST_JS}
${REWRITE_MEDIA_JS}
var doc = document;
var HOVER_ATTR = ${JSON.stringify(HOVER_ATTR)};
var STYLE_ID = ${JSON.stringify(HOVER_STYLE_ID)};
var HOVER_RE = /:hover(?![\\w-])/g;
var chain = [];
var lastCursor = null;
var lastX = 0, lastY = 0;
var lastClick = { t: 0, x: -1e9, y: -1e9, n: 0 };
var styleEl = null;
var scanned = false, lastScan = 0, scanTimer = null;
var fetched = {};

/* ---------- helpers ---------- */
function elAt(x, y) {
  var el = null;
  try { el = doc.elementFromPoint ? doc.elementFromPoint(x, y) : null; } catch (e) { el = null; }
  var guard = 0;
  while (el && el.shadowRoot && el.shadowRoot.elementFromPoint && guard++ < 20) {
    var inner = el.shadowRoot.elementFromPoint(x, y);
    if (!inner || inner === el) break;
    el = inner;
  }
  return el;
}
function parentOf(el) {
  if (el.parentElement) return el.parentElement;
  var p = el.parentNode;
  return p && p.nodeType === 11 && p.host ? p.host : null;
}
function chainOf(el) {
  var arr = [];
  while (el && el.nodeType === 1) { arr.push(el); el = parentOf(el); }
  return arr;
}
var NON_BUBBLING = { mouseenter: 1, mouseleave: 1, pointerenter: 1, pointerleave: 1 };
function fire(target, type, x, y, o) {
  if (!target || !target.dispatchEvent) return true;
  o = o || {};
  var bubbles = !NON_BUBBLING[type];
  var init = {
    bubbles: bubbles, cancelable: bubbles, composed: true, view: window,
    clientX: x, clientY: y, screenX: x, screenY: y,
    button: o.button || 0, buttons: o.buttons || 0, detail: o.detail || 0,
    relatedTarget: o.relatedTarget || null
  };
  var ev = null;
  try {
    if (type.indexOf('pointer') === 0 && typeof PointerEvent === 'function') {
      init.pointerId = 1; init.pointerType = 'mouse'; init.isPrimary = true;
      init.width = 1; init.height = 1; init.pressure = init.buttons ? 0.5 : 0;
      if (type === 'pointermove' || type === 'pointerover' || type === 'pointerenter' || type === 'pointerout' || type === 'pointerleave') init.button = -1;
      ev = new PointerEvent(type, init);
    } else if (type === 'wheel' && typeof WheelEvent === 'function') {
      init.deltaX = o.deltaX || 0; init.deltaY = o.deltaY || 0; init.deltaZ = 0; init.deltaMode = 0;
      ev = new WheelEvent(type, init);
    }
  } catch (e) { ev = null; }
  if (!ev) {
    try { ev = new MouseEvent(type, init); } catch (e2) { return true; }
    if (type === 'wheel') { try { ev.deltaX = o.deltaX || 0; ev.deltaY = o.deltaY || 0; } catch (e3) {} }
  }
  return target.dispatchEvent(ev);
}

/* ---------- :hover emulation via cloned CSS rules ---------- */
function collect(rules, out) {
  if (!rules) return;
  for (var i = 0; i < rules.length; i++) {
    var r = rules[i];
    try {
      if (r.type === 1 && typeof r.selectorText === 'string') {
        if (r.selectorText.indexOf(':hover') >= 0 && r.style) {
          var sel = r.selectorText.replace(HOVER_RE, '[' + HOVER_ATTR + ']');
          out.push(sel + ' { ' + r.style.cssText + ' }');
        }
      } else if (r.type === 3) {
        var inner0 = [];
        try { collect(r.styleSheet && r.styleSheet.cssRules, inner0); } catch (e) {}
        pushWrapped(out, inner0, r.media && r.media.mediaText);
      } else if (r.cssRules) {
        var inner = [];
        collect(r.cssRules, inner);
        if (!inner.length) continue;
        if (r.type === 4 && r.media) pushWrapped(out, inner, r.media.mediaText);
        else if (r.type === 12 && r.conditionText) out.push('@supports ' + r.conditionText + ' { ' + inner.join('\\n') + ' }');
        else Array.prototype.push.apply(out, inner);
      }
    } catch (e) {}
  }
}
function pushWrapped(out, inner, mediaText) {
  if (!inner.length) return;
  if (mediaText && mediaText !== 'all') out.push('@media ' + dvRewriteMedia(mediaText) + ' { ' + inner.join('\\n') + ' }');
  else Array.prototype.push.apply(out, inner);
}
function absolutizeUrls(text, base) {
  return text.replace(/url\\(\\s*(['"]?)([^'")]+)\\1\\s*\\)/g, function (m, q, u) {
    if (/^(data:|#|[a-z][a-z0-9+.-]*:)/i.test(u)) return m;
    try { return 'url("' + new URL(u, base).href + '")'; } catch (e) { return m; }
  });
}
function parseCss(text) {
  var out = [];
  try {
    if (typeof CSSStyleSheet === 'function' && CSSStyleSheet.prototype.replaceSync) {
      var sheet = new CSSStyleSheet();
      sheet.replaceSync(text);
      collect(sheet.cssRules, out);
      return out;
    }
  } catch (e) { out = []; }
  try {
    var tmp = doc.createElement('style');
    tmp.setAttribute('media', 'not all');
    tmp.textContent = text;
    (doc.head || doc.documentElement).appendChild(tmp);
    try { collect(tmp.sheet && tmp.sheet.cssRules, out); } finally { tmp.parentNode && tmp.parentNode.removeChild(tmp); }
  } catch (e) {}
  return out;
}
function fetchSheet(href, media) {
  if (fetched[href] !== undefined || typeof fetch !== 'function') return;
  fetched[href] = null;
  fetch(href, { mode: 'cors', credentials: 'omit' })
    .then(function (r) { return r.ok ? r.text() : ''; })
    .then(function (text) {
      var rules = text ? parseCss(absolutizeUrls(text, href)) : [];
      var wrapped = [];
      pushWrapped(wrapped, rules, media);
      fetched[href] = wrapped;
      if (wrapped.length) rebuild();
    })
    .catch(function () { fetched[href] = []; });
}
function sheetList() {
  var list = [];
  try { for (var i = 0; i < doc.styleSheets.length; i++) list.push(doc.styleSheets[i]); } catch (e) {}
  try { if (doc.adoptedStyleSheets) for (var j = 0; j < doc.adoptedStyleSheets.length; j++) list.push(doc.adoptedStyleSheets[j]); } catch (e) {}
  return list;
}
function rebuild() {
  scanned = true;
  lastScan = Date.now();
  var out = [];
  var sheets = sheetList();
  for (var i = 0; i < sheets.length; i++) {
    var s = sheets[i];
    if (!s || s.disabled || (styleEl && s.ownerNode === styleEl)) continue;
    var rules = null;
    try { rules = s.cssRules; } catch (e) { rules = null; }
    var media = s.media && s.media.mediaText;
    if (rules) {
      var inner = [];
      collect(rules, inner);
      pushWrapped(out, inner, media);
    } else if (s.href) {
      var f = fetched[s.href];
      if (f) Array.prototype.push.apply(out, f);
      else if (f === undefined) fetchSheet(s.href, media);
    }
  }
  var css = out.join('\\n');
  if (!styleEl) {
    styleEl = doc.createElement('style');
    styleEl.id = STYLE_ID;
  }
  if (styleEl.textContent !== css) styleEl.textContent = css;
  var parent = doc.head || doc.documentElement;
  if (parent && styleEl.parentNode !== parent) parent.appendChild(styleEl);
}
function scheduleScan(delay) {
  if (!scanned) return;
  if (scanTimer) clearTimeout(scanTimer);
  scanTimer = setTimeout(function () { scanTimer = null; try { rebuild(); } catch (e) {} }, delay);
}
function isStyleNode(n) {
  if (!n || n.nodeType !== 1 || n === styleEl) return false;
  var tag = n.tagName;
  return tag === 'STYLE' || (tag === 'LINK' && /stylesheet/i.test(n.getAttribute('rel') || ''));
}
try {
  new MutationObserver(function (records) {
    for (var i = 0; i < records.length; i++) {
      var r = records[i];
      if (r.target !== styleEl && isStyleNode(r.target)) { scheduleScan(500); return; }
      for (var j = 0; j < r.addedNodes.length; j++) {
        if (isStyleNode(r.addedNodes[j])) { scheduleScan(500); return; }
      }
    }
  }).observe(doc, { childList: true, subtree: true });
} catch (e) {}
doc.addEventListener('DOMContentLoaded', function () { scheduleScan(0); });
window.addEventListener('load', function () { scheduleScan(0); });
doc.addEventListener('load', function (e) { if (e.target && e.target.tagName === 'LINK') scheduleScan(500); }, true);

/* ---------- hover chain ---------- */
function contains(arr, el) { for (var i = 0; i < arr.length; i++) if (arr[i] === el) return true; return false; }
function setHover(newTarget, x, y) {
  var oldChain = chain;
  var oldTarget = oldChain[0] || null;
  var newChain = newTarget ? chainOf(newTarget) : [];
  if (oldTarget === newTarget) return;
  var leaving = [], entering = [], i;
  for (i = 0; i < oldChain.length; i++) if (!contains(newChain, oldChain[i])) leaving.push(oldChain[i]);
  for (i = newChain.length - 1; i >= 0; i--) if (!contains(oldChain, newChain[i])) entering.push(newChain[i]);
  chain = newChain;
  for (i = 0; i < leaving.length; i++) { try { leaving[i].removeAttribute(HOVER_ATTR); } catch (e) {} }
  for (i = 0; i < entering.length; i++) { try { entering[i].setAttribute(HOVER_ATTR, ''); } catch (e) {} }
  if (oldTarget) {
    fire(oldTarget, 'pointerout', x, y, { relatedTarget: newTarget });
    for (i = 0; i < leaving.length; i++) fire(leaving[i], 'pointerleave', x, y, { relatedTarget: newTarget });
    fire(oldTarget, 'mouseout', x, y, { relatedTarget: newTarget });
    for (i = 0; i < leaving.length; i++) fire(leaving[i], 'mouseleave', x, y, { relatedTarget: newTarget });
  }
  if (newTarget) {
    fire(newTarget, 'pointerover', x, y, { relatedTarget: oldTarget });
    for (i = 0; i < entering.length; i++) fire(entering[i], 'pointerenter', x, y, { relatedTarget: oldTarget });
    fire(newTarget, 'mouseover', x, y, { relatedTarget: oldTarget });
    for (i = 0; i < entering.length; i++) fire(entering[i], 'mouseenter', x, y, { relatedTarget: oldTarget });
  }
}

/* ---------- cursor ---------- */
var TEXT_INPUT = /^(text|search|email|url|tel|password|number|date|datetime-local|month|week|time)$/i;
function isTextField(el) {
  if (!el || el.nodeType !== 1) return false;
  if (el.tagName === 'TEXTAREA') return true;
  if (el.tagName === 'INPUT') return TEXT_INPUT.test(el.getAttribute('type') || 'text');
  return !!el.isContentEditable;
}
function cursorFor(el) {
  if (!el) return 'default';
  var c = 'auto';
  try { c = String(getComputedStyle(el).cursor || 'auto'); } catch (e) {}
  if (c.indexOf('url(') >= 0) {
    var parts = c.split(',');
    c = parts[parts.length - 1].trim() || 'auto';
  }
  if (c === 'auto' || c === '') {
    var link = el.closest ? el.closest('a[href], area[href]') : null;
    if (link) return 'pointer';
    if (isTextField(el)) return 'text';
    return 'default';
  }
  return c;
}
function updateCursor(el) {
  var c = cursorFor(el);
  if (c !== lastCursor) { lastCursor = c; dvPost({ type: 'cursor', cursor: c }); }
}

/* ---------- focus ---------- */
var FOCUSABLE = 'input, textarea, select, button, a[href], [contenteditable=""], [contenteditable="true"], [tabindex]';
function focusTarget(el) {
  var f = el && el.closest ? el.closest(FOCUSABLE) : null;
  if (f && (f.disabled || f.getAttribute('contenteditable') === 'false')) return null;
  return f;
}
function doFocus(el) {
  var f = focusTarget(el);
  if (!f) {
    try { var a = doc.activeElement; if (a && a !== doc.body && a.blur) a.blur(); } catch (e) {}
    return;
  }
  if (f.tagName === 'SELECT' && typeof f.showPicker === 'function') {
    try { f.focus({ preventScroll: true }); f.showPicker(); return; } catch (e) {}
  }
  try { f.focus({ preventScroll: true }); } catch (e) { try { f.focus(); } catch (e2) {} }
}

/* ---------- scrolling ---------- */
function canScroll(el, dx, dy) {
  var cs;
  try { cs = getComputedStyle(el); } catch (e) { return false; }
  var oy = cs.overflowY || cs.overflow, ox = cs.overflowX || cs.overflow;
  var scrollableY = /(auto|scroll|overlay)/.test(oy) && el.scrollHeight > el.clientHeight;
  var scrollableX = /(auto|scroll|overlay)/.test(ox) && el.scrollWidth > el.clientWidth;
  if (dy > 0 && scrollableY && el.scrollTop + el.clientHeight < el.scrollHeight - 0.5) return true;
  if (dy < 0 && scrollableY && el.scrollTop > 0) return true;
  if (dx > 0 && scrollableX && el.scrollLeft + el.clientWidth < el.scrollWidth - 0.5) return true;
  if (dx < 0 && scrollableX && el.scrollLeft > 0) return true;
  return false;
}
function scrollTargetFor(el, dx, dy) {
  var root = doc.scrollingElement || doc.documentElement;
  while (el && el.nodeType === 1) {
    if (el !== root && el !== doc.body && canScroll(el, dx, dy)) return el;
    el = parentOf(el);
  }
  return null;
}
function scrollElement(el, dx, dy) {
  if (typeof el.scrollBy === 'function') {
    try { el.scrollBy({ left: dx, top: dy, behavior: 'instant' }); return; } catch (e) {}
  }
  el.scrollLeft = el.scrollLeft + dx;
  el.scrollTop = el.scrollTop + dy;
}

/* ---------- public API ---------- */
function move(x, y) {
  lastX = x; lastY = y;
  if (!scanned) { try { rebuild(); } catch (e) {} }
  else if (Date.now() - lastScan > 3000) scheduleScan(300);
  var t = elAt(x, y);
  setHover(t, x, y);
  if (t) {
    fire(t, 'pointermove', x, y);
    fire(t, 'mousemove', x, y);
  }
  updateCursor(t);
  return t;
}
function press(x, y, button) {
  var t = move(x, y);
  if (!t) return null;
  var bits = button === 2 ? 2 : 1;
  fire(t, 'pointerdown', x, y, { button: button, buttons: bits });
  var ok = fire(t, 'mousedown', x, y, { button: button, buttons: bits, detail: 1 });
  if (ok && button === 0) doFocus(t);
  var t2 = elAt(x, y) || t;
  fire(t2, 'pointerup', x, y, { button: button });
  fire(t2, 'mouseup', x, y, { button: button, detail: 1 });
  return t2;
}
var api = {
  move: function (x, y) { move(+x || 0, +y || 0); },
  click: function (x, y) {
    x = +x || 0; y = +y || 0;
    var t = press(x, y, 0);
    if (!t) return;
    var now = Date.now();
    var n = (now - lastClick.t < 500 && Math.abs(x - lastClick.x) < 5 && Math.abs(y - lastClick.y) < 5) ? lastClick.n + 1 : 1;
    lastClick = { t: now, x: x, y: y, n: n };
    fire(t, 'click', x, y, { button: 0, detail: n });
    if (n === 2) fire(t, 'dblclick', x, y, { button: 0, detail: 2 });
  },
  contextMenu: function (x, y) {
    x = +x || 0; y = +y || 0;
    var t = press(x, y, 2);
    if (!t) return;
    fire(t, 'contextmenu', x, y, { button: 2, buttons: 0 });
  },
  scroll: function (x, y, dx, dy) {
    x = +x || 0; y = +y || 0; dx = +dx || 0; dy = +dy || 0;
    var t = elAt(x, y) || doc.body || doc.documentElement;
    var ok = fire(t, 'wheel', x, y, { deltaX: dx, deltaY: dy });
    if (!ok) return;
    var target = scrollTargetFor(t, dx, dy);
    if (target) scrollElement(target, dx, dy);
    else if (typeof window.scrollBy === 'function') {
      try { window.scrollBy({ left: dx, top: dy, behavior: 'instant' }); } catch (e) { window.scrollBy(dx, dy); }
    }
    if (chain.length) {
      var now = elAt(lastX, lastY);
      if (now !== chain[0]) move(lastX, lastY);
    }
  },
  leave: function () {
    setHover(null, lastX, lastY);
    lastCursor = null;
  },
  rescan: function () { rebuild(); }
};
Object.defineProperty(window, '__dv', { value: api, enumerable: false, configurable: true, writable: false });
`);
}

// src/core/injected/viewport.ts
var VIEWPORT_CONTENT = "width=device-width, initial-scale=1";
function buildViewportScript() {
  return iife(`
${IS_TOP_JS}
if (!isTop || window.__dvViewport) return;
Object.defineProperty(window, '__dvViewport', { value: true, configurable: true });
var CONTENT = ${JSON.stringify(VIEWPORT_CONTENT)};
var ours = document.createElement('meta');
ours.setAttribute('name', 'viewport');
ours.setAttribute('content', CONTENT);
ours.setAttribute('data-dv-viewport', '');
function place() {
  var parent = document.head || document.documentElement;
  if (!parent) return;
  if (ours.parentNode !== parent) parent.insertBefore(ours, parent.firstChild);
}
function neutralize(el) {
  if (!el || el.nodeType !== 1) return;
  if (el === ours) {
    if (el.getAttribute('content') !== CONTENT) el.setAttribute('content', CONTENT);
    if (el.getAttribute('name') !== 'viewport') el.setAttribute('name', 'viewport');
    return;
  }
  if (el.tagName === 'META' && String(el.getAttribute('name') || '').toLowerCase() === 'viewport') {
    el.setAttribute('data-dv-original-content', el.getAttribute('content') || '');
    el.setAttribute('name', 'dv-disabled-viewport');
    el.removeAttribute('content');
  }
}
function scan(root) {
  if (!root || !root.querySelectorAll) return;
  if (root.tagName === 'META') neutralize(root);
  var list = root.querySelectorAll('meta[name]');
  for (var i = 0; i < list.length; i++) neutralize(list[i]);
}
place();
scan(document);
var mo = new MutationObserver(function (records) {
  for (var i = 0; i < records.length; i++) {
    var r = records[i];
    if (r.type === 'attributes') { neutralize(r.target); continue; }
    for (var j = 0; j < r.addedNodes.length; j++) scan(r.addedNodes[j]);
  }
  if (document.head && ours.parentNode !== document.head) place();
  else if (!ours.parentNode) place();
});
mo.observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['content', 'name'] });
`);
}

// src/core/injected/index.ts
function buildBeforeContentScript(options) {
  const parts = [buildViewportScript()];
  if (options.desktopMode) parts.push(buildDesktopEnvScript(options.screen, options.agent));
  parts.push(buildMouseEngineScript(), buildInfoReporterScript());
  return parts.join("") + "true;";
}
function buildScreenUpdateCall(screen) {
  const w = jsInt(screen?.width, 1920);
  const h = jsInt(screen?.height, 1080);
  return `try{window.__dvSetScreen&&window.__dvSetScreen(${w},${h});window.__dvRequestInfo&&window.__dvRequestInfo();}catch(e){}true;`;
}
function buildInfoRequestCall() {
  return "try{window.__dvRequestInfo&&window.__dvRequestInfo();}catch(e){}true;";
}
function call(method, args) {
  return `try{window.__dv && window.__dv.${method}(${args.map(jsNum).join(",")});}catch(e){}true;`;
}
var mouse = {
  move(x, y) {
    return call("move", [x, y]);
  },
  click(x, y) {
    return call("click", [x, y]);
  },
  contextMenu(x, y) {
    return call("contextMenu", [x, y]);
  },
  scroll(x, y, dx, dy) {
    return call("scroll", [x, y, dx, dy]);
  },
  leave() {
    return call("leave", []);
  }
};

// src/core/testPage.ts
var CSS = `
:root{--bg:#f5f6f8;--card:#fff;--text:#16181d;--muted:#5d6472;--line:#e3e6eb;--accent:#2f6fec;--accent-soft:#e6eefe;--ok:#1a8f4c;--ok-soft:#e3f5ea;--bad:#c9372c;--bad-soft:#fbe7e5;--shadow:0 1px 2px rgba(16,24,40,.06),0 4px 16px rgba(16,24,40,.06)}
@media (prefers-color-scheme:dark){:root{--bg:#0f1115;--card:#181b21;--text:#eceef2;--muted:#9aa2b1;--line:#2a2f38;--accent:#6a9bff;--accent-soft:#1c2740;--ok:#4cc781;--ok-soft:#15291e;--bad:#ff7a6e;--bad-soft:#35191a;--shadow:none}}
*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--text);font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%}
.wrap{max-width:1600px;margin:0 auto;padding:24px}
header{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:8px 24px;margin-bottom:20px}
h1{font-size:28px;margin:0;letter-spacing:-.02em}
h1 span{color:var(--accent)}
.lead{margin:4px 0 0;color:var(--muted);font-size:17px}
.layout-tag{font-weight:600;font-size:14px;padding:6px 12px;border-radius:999px;background:var(--accent-soft);color:var(--accent);white-space:nowrap}
.layout-tag::after{content:"Mobil-Layout · 1 Spalte"}
.hero{background:var(--card);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow);padding:24px;margin-bottom:20px;display:grid;gap:20px;grid-template-columns:1fr}
.big-label{font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:600}
.big{font-size:56px;font-weight:700;letter-spacing:-.03em;line-height:1.05;font-variant-numeric:tabular-nums}
.big small{font-size:22px;font-weight:500;color:var(--muted);margin-left:6px}
.stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.stat{border:1px solid var(--line);border-radius:12px;padding:12px 14px}
.stat b{display:block;font-size:22px;font-variant-numeric:tabular-nums}
.stat span{font-size:13px;color:var(--muted)}
.bp{margin-top:4px}
.bp-bar{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-top:8px}
.bp-seg{border-radius:10px;padding:8px 6px;text-align:center;background:var(--bg);border:1px solid var(--line);color:var(--muted);font-size:13px;transition:background .2s,color .2s}
.bp-seg b{display:block;font-size:15px}
.bp-seg.on{background:var(--accent);border-color:var(--accent);color:#fff}
.bp-seg.cur{outline:3px solid var(--accent-soft);outline-offset:1px}
.bp-note{margin-top:8px;font-size:14px;color:var(--muted)}
.grid{display:grid;gap:20px;grid-template-columns:1fr}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow);padding:20px}
.card h2{font-size:18px;margin:0 0 4px}
.card p.sub{margin:0 0 14px;color:var(--muted);font-size:14px}
.checks{list-style:none;margin:0;padding:0}
.checks li{display:grid;grid-template-columns:28px 1fr;gap:4px 10px;padding:9px 0;border-top:1px solid var(--line);align-items:start}
.checks li:first-child{border-top:0}
.ico{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:14px}
.ico.ok{background:var(--ok-soft);color:var(--ok)}
.ico.bad{background:var(--bad-soft);color:var(--bad)}
.checks .name{font-weight:600;font-size:15px}
.checks code{display:block;grid-column:2;font:12px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--muted);word-break:break-all}
.summary{margin-top:10px;font-weight:600}
.menu{position:relative;display:inline-block}
.menu-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 18px;border-radius:12px;background:var(--accent-soft);color:var(--accent);font-weight:600;border:1px solid transparent;cursor:pointer;user-select:none}
.menu:hover .menu-btn{background:var(--accent);color:#fff}
.menu-list{display:none;position:absolute;left:0;top:100%;margin-top:6px;min-width:240px;background:var(--card);border:1px solid var(--line);border-radius:12px;box-shadow:0 12px 32px rgba(16,24,40,.18);padding:6px;z-index:5}
.menu:hover .menu-list{display:block}
.menu-list a{display:block;padding:9px 12px;border-radius:8px;color:var(--text);text-decoration:none}
.menu-list a:hover{background:var(--accent-soft);color:var(--accent)}
.hover-box{margin-top:16px;padding:16px;border-radius:12px;border:2px dashed var(--line);text-align:center;color:var(--muted);transition:all .15s}
.hover-box:hover{border-style:solid;border-color:var(--ok);background:var(--ok-soft);color:var(--ok)}
.hover-box:hover::after{content:" – :hover aktiv ✓"}
.row{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
button.btn{font:inherit;font-weight:600;padding:12px 18px;border-radius:12px;border:0;background:var(--accent);color:#fff;cursor:pointer}
button.btn:hover{filter:brightness(1.1)}
button.btn:active{transform:translateY(1px)}
.rc{flex:1 1 200px;padding:16px;border-radius:12px;background:var(--bg);border:1px solid var(--line);text-align:center;color:var(--muted);user-select:none;-webkit-user-select:none}
.count{font-variant-numeric:tabular-nums;font-weight:700;color:var(--text)}
.log{margin-top:14px;font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--muted);min-height:3em}
footer{margin:24px 0 8px;color:var(--muted);font-size:13px;text-align:center}
@media (min-width:640px){.layout-tag::after{content:"Kleines Tablet-Layout · 1 Spalte"}.stats{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (min-width:768px){.layout-tag::after{content:"Tablet-Layout · 1 Spalte"}}
@media (min-width:1024px){.layout-tag::after{content:"Desktop-Layout · 2 Spalten"}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.hero{grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);align-items:center}.big{font-size:72px}.wrap{padding:32px}}
@media (min-width:1280px){.layout-tag::after{content:"Großes Desktop-Layout · 3 Spalten"}.grid{grid-template-columns:repeat(3,minmax(0,1fr))}.big{font-size:84px}h1{font-size:32px}}
@media (min-width:1536px){.layout-tag::after{content:"Breitbild-Layout · 3 Spalten"}}
`;
var BODY = `
<div class="wrap">
  <header>
    <div>
      <h1><span>Deskview</span> Testseite</h1>
      <p class="lead">Diese Seite zeigt, was Websites von deinem virtuellen Monitor sehen.</p>
    </div>
    <div class="layout-tag" title="Reine CSS-Media-Queries"></div>
  </header>

  <section class="hero">
    <div>
      <div class="big-label">Fenstergröße (innerWidth × innerHeight)</div>
      <div class="big" id="vp">– × –</div>
      <div class="bp-note" id="vp-note">So breit „denkt“ die Website, dass dein Browserfenster ist.</div>
    </div>
    <div>
      <div class="stats">
        <div class="stat"><b id="scr">–</b><span>Bildschirm (screen)</span></div>
        <div class="stat"><b id="dpr">–</b><span>Pixeldichte (devicePixelRatio)</span></div>
        <div class="stat"><b id="cols">–</b><span>Spalten in diesem Layout</span></div>
      </div>
      <div class="bp">
        <div class="bp-bar" id="bp-bar">
          <div class="bp-seg" data-min="0"><b>xs</b>&lt; 640</div>
          <div class="bp-seg" data-min="640"><b>sm</b>≥ 640</div>
          <div class="bp-seg" data-min="768"><b>md</b>≥ 768</div>
          <div class="bp-seg" data-min="1024"><b>lg</b>≥ 1024</div>
          <div class="bp-seg" data-min="1280"><b>xl</b>≥ 1280</div>
          <div class="bp-seg" data-min="1536"><b>2xl</b>≥ 1536</div>
        </div>
        <div class="bp-note" id="bp-note">Breakpoints wie in Tailwind CSS.</div>
      </div>
    </div>
  </section>

  <div class="grid" id="grid">
    <section class="card">
      <h2>Wirkt das wie ein Desktop?</h2>
      <p class="sub">Merkmale, an denen Websites Maus und großen Bildschirm erkennen.</p>
      <ul class="checks" id="checks"></ul>
      <div class="summary" id="summary"></div>
    </section>

    <section class="card">
      <h2>Hover testen</h2>
      <p class="sub">Tippe unten auf „Maus“ und bewege den Zeiger über das Menü.</p>
      <nav class="menu">
        <div class="menu-btn">☰ Fahre mit der Maus hierüber ▾</div>
        <div class="menu-list">
          <a href="#produkte">Produkte</a>
          <a href="#preise">Preise</a>
          <a href="#hilfe">Hilfe &amp; Kontakt</a>
        </div>
      </nav>
      <div class="hover-box" id="hover-box">Hover-Fläche (nur CSS <code>:hover</code>)</div>
      <div class="log">JavaScript-Hover (mouseenter): <span class="count" id="enter-count">0</span></div>
    </section>

    <section class="card">
      <h2>Klicken &amp; Rechtsklick</h2>
      <p class="sub">Tippen = Klick, lange drücken = Rechtsklick.</p>
      <div class="row">
        <button class="btn" id="click-btn" type="button">Klick mich</button>
        <span>Klicks: <span class="count" id="click-count">0</span></span>
      </div>
      <div class="row" style="margin-top:14px">
        <div class="rc" id="rc-area">Rechtsklick hier<br>Rechtsklicks: <span class="count" id="rc-count">0</span></div>
      </div>
      <div class="log" id="log"></div>
    </section>
  </div>

  <footer>Hinweis: Auf dem iPhone rendert immer WebKit (die Safari-Engine) – auch wenn die Kennung „Chrome“ oder „Firefox“ lautet.</footer>
</div>
`;
var SCRIPT = `
(function () {
  function $(id) { return document.getElementById(id); }
  function mq(q) { try { return !!(window.matchMedia && window.matchMedia(q).matches); } catch (e) { return false; } }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function columns(w) { return w >= 1280 ? 3 : w >= 1024 ? 2 : 1; }
  function render() {
    var w = window.innerWidth, h = window.innerHeight;
    var s = window.screen || {};
    $('vp').innerHTML = w + ' × ' + h + '<small>px</small>';
    $('scr').textContent = (s.width || '–') + ' × ' + (s.height || '–');
    $('dpr').textContent = String(Math.round((window.devicePixelRatio || 1) * 100) / 100);
    $('cols').textContent = String(columns(w));
    var segs = document.querySelectorAll('.bp-seg');
    var cur = null, active = [];
    for (var i = 0; i < segs.length; i++) {
      var min = +segs[i].getAttribute('data-min');
      var on = w >= min;
      segs[i].className = 'bp-seg' + (on ? ' on' : '');
      if (on) { cur = segs[i]; if (min > 0) active.push(segs[i].querySelector('b').textContent); }
    }
    if (cur) cur.className += ' cur';
    $('bp-note').textContent = active.length
      ? 'Aktive Breakpoints: ' + active.join(', ') + ' (Tailwind CSS)'
      : 'Keine Breakpoints aktiv – die Seite zeigt ihr Handy-Layout.';
    $('vp-note').textContent = w >= 1024
      ? 'Websites zeigen dir ihr Desktop-Layout.'
      : 'Unter 1024 px zeigen viele Websites ihr Mobil- oder Tablet-Layout.';
    var touch = 'ontouchstart' in window;
    var mtp = navigator.maxTouchPoints || 0;
    var platform = String(navigator.platform || '');
    var ua = String(navigator.userAgent || '');
    var checks = [
      ['Maus-Hover verfügbar', '(hover: hover) → ' + mq('(hover: hover)'), mq('(hover: hover)')],
      ['Feiner Zeiger (Maus)', '(pointer: fine) → ' + mq('(pointer: fine)'), mq('(pointer: fine)')],
      ['Keine Touch-Ereignisse', "'ontouchstart' in window → " + touch, !touch],
      ['Keine Touch-Punkte', 'navigator.maxTouchPoints → ' + mtp, mtp === 0],
      ['Desktop-Plattform', 'navigator.platform → ' + (platform || '(leer)'), !!platform && !/iPhone|iPad|iPod|Android|arm/i.test(platform)],
      ['Desktop-Kennung', ua, !!ua && !/iPhone|iPad|Android|Mobile/i.test(ua)]
    ];
    var html = '', ok = 0;
    for (var j = 0; j < checks.length; j++) {
      var c = checks[j];
      if (c[2]) ok++;
      html += '<li><span class="ico ' + (c[2] ? 'ok' : 'bad') + '">' + (c[2] ? '✓' : '✗') + '</span>' +
        '<span class="name">' + esc(c[0]) + '</span><code>' + esc(c[1]) + '</code></li>';
    }
    $('checks').innerHTML = html;
    $('summary').textContent = ok + ' von ' + checks.length + ' Merkmalen wirken wie ein Desktop-Browser' +
      (ok === checks.length ? ' ✓' : ' – „Desktop-Modus“ unter „Mehr“ einschalten.');
  }
  var logLines = [];
  function log(t) {
    var d = new Date();
    logLines.unshift(('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2) + '  ' + t);
    logLines = logLines.slice(0, 4);
    $('log').innerHTML = logLines.map(esc).join('<br>');
  }
  function init() {
    var clicks = 0, rcs = 0, enters = 0;
    $('click-btn').addEventListener('click', function (e) {
      clicks++; $('click-count').textContent = String(clicks);
      log('click bei ' + Math.round(e.clientX) + ', ' + Math.round(e.clientY));
    });
    $('rc-area').addEventListener('contextmenu', function (e) {
      e.preventDefault();
      rcs++; $('rc-count').textContent = String(rcs);
      log('contextmenu (Rechtsklick)');
    });
    $('hover-box').addEventListener('mouseenter', function () {
      enters++; $('enter-count').textContent = String(enters);
    });
    var t = null;
    window.addEventListener('resize', function () {
      if (t) clearTimeout(t);
      t = setTimeout(render, 50);
    });
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
`;
var TEST_PAGE_HTML = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Deskview Testseite</title>
<style>${CSS}</style>
</head>
<body>
${BODY}
<script>${SCRIPT}</script>
</body>
</html>`;

// src/viewport/InfoBar.tsx
import { Platform, StyleSheet as StyleSheet12, Text as Text12, View as View10 } from "react-native";

// src/viewport/screenshot.ts
import * as Sharing from "expo-sharing";
var pad2 = (n) => String(n).padStart(2, "0");
function formatDateTime(date) {
  return `${pad2(date.getDate())}.${pad2(date.getMonth() + 1)}.${date.getFullYear()} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}
async function shareScreenshot(uri, meta) {
  const fileUri = uri.startsWith("/") ? `file://${uri}` : uri;
  const title = meta.title.trim() || meta.url;
  await Sharing.shareAsync(fileUri, {
    mimeType: "image/png",
    UTI: "public.png",
    dialogTitle: `Screenshot: ${title} (${formatResolution(meta.resolution)})`
  });
}
function describeScreenshot(meta) {
  const lines = [
    `Titel: ${meta.title.trim() || "–"}`,
    `URL: ${meta.url}`,
    `Viewport: ${formatResolution(meta.resolution)} CSS-Pixel`,
    `Kennung: ${meta.agentLabel} (rendert mit WebKit)`,
    `Zeit: ${formatDateTime(meta.takenAt)}`
  ];
  return lines.join("\n");
}

// src/viewport/InfoBar.tsx
import { jsx as jsx13, jsxs as jsxs12 } from "react/jsx-runtime";
var INFO_BAR_HEIGHT = 44;
var MONO = Platform.select({ ios: "Menlo", default: "monospace" });
function InfoBar({ meta, width }) {
  const url = meta.url === TEST_PAGE_URL ? "Deskview-Testseite" : meta.url;
  const text = [url, formatResolution(meta.resolution), meta.agentLabel, formatDateTime(meta.takenAt)].join(" · ");
  return /* @__PURE__ */ jsxs12(View10, { style: [styles12.bar, { width }], children: [
    /* @__PURE__ */ jsx13(Text12, { style: styles12.text, numberOfLines: 1, ellipsizeMode: "middle", children: text }),
    /* @__PURE__ */ jsx13(Text12, { style: styles12.brand, children: "Deskview" })
  ] });
}
var styles12 = StyleSheet12.create({
  bar: {
    height: INFO_BAR_HEIGHT,
    backgroundColor: "#1c1c1e",
    borderTopWidth: 1,
    borderTopColor: "#3a3a3c",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14
  },
  text: {
    flex: 1,
    color: "#e5e5ea",
    fontFamily: MONO,
    fontSize: 14
  },
  brand: {
    marginLeft: 16,
    color: "#8e8e93",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5
  }
});

// src/viewport/TrackpadOverlay.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect as useEffect6, useMemo as useMemo4, useRef as useRef5 } from "react";
import {
  Animated as Animated3,
  PanResponder,
  StyleSheet as StyleSheet13,
  View as View11
} from "react-native";
import { jsx as jsx14, jsxs as jsxs13 } from "react/jsx-runtime";
var ACCELERATION = 1.2;
var SEND_INTERVAL_MS = 32;
var TAP_SLOP_PT = 8;
var LONG_PRESS_MS = 500;
var CURSOR_SIZE = 26;
function cursorIcon(cursor) {
  if (cursor === "pointer") return { name: "hand-pointing-up", hx: 0.42, hy: 0.1 };
  if (cursor === "text" || cursor === "vertical-text") return { name: "cursor-text", hx: 0.5, hy: 0.5 };
  return { name: "cursor-default", hx: 0.27, hy: 0.1 };
}
var clamp = (v, min, max) => Math.min(max, Math.max(min, v));
function centroid(evt) {
  const t = evt.nativeEvent.touches;
  const n = Math.min(t.length, 2);
  let x = 0;
  let y = 0;
  for (let i = 0; i < n; i++) {
    x += t[i].pageX;
    y += t[i].pageY;
  }
  return { x: x / n, y: y / n };
}
function TrackpadOverlay({ geometry, cursor, inject }) {
  const geoRef = useRef5(geometry);
  geoRef.current = geometry;
  const injectRef = useRef5(inject);
  injectRef.current = inject;
  const pos = useRef5({ x: geometry.cssWidth / 2, y: geometry.cssHeight / 2 });
  const screenX = useRef5(new Animated3.Value(0)).current;
  const screenY = useRef5(new Animated3.Value(0)).current;
  const updateScreenPos = () => {
    const g = geoRef.current;
    screenX.setValue(g.offsetX + pos.current.x * g.scale);
    screenY.setValue(g.offsetY + pos.current.y * g.scale);
  };
  useEffect6(() => {
    pos.current = {
      x: clamp(pos.current.x, 0, geometry.cssWidth - 1),
      y: clamp(pos.current.y, 0, geometry.cssHeight - 1)
    };
    updateScreenPos();
  }, [geometry.cssWidth, geometry.cssHeight, geometry.scale, geometry.offsetX, geometry.offsetY]);
  const sender = useRef5({
    lastSent: 0,
    timer: null,
    movePending: false,
    scrollDx: 0,
    scrollDy: 0
  }).current;
  const flush = () => {
    if (sender.timer) {
      clearTimeout(sender.timer);
      sender.timer = null;
    }
    sender.lastSent = Date.now();
    const { x, y } = pos.current;
    const rx = Math.round(x);
    const ry = Math.round(y);
    if (sender.movePending) {
      sender.movePending = false;
      injectRef.current(mouse.move(rx, ry));
    }
    if (sender.scrollDx !== 0 || sender.scrollDy !== 0) {
      const dx = sender.scrollDx;
      const dy = sender.scrollDy;
      sender.scrollDx = 0;
      sender.scrollDy = 0;
      injectRef.current(mouse.scroll(rx, ry, dx, dy));
    }
  };
  const schedule = () => {
    const wait = SEND_INTERVAL_MS - (Date.now() - sender.lastSent);
    if (wait <= 0) flush();
    else if (!sender.timer) sender.timer = setTimeout(flush, wait);
  };
  const gesture = useRef5({
    startTime: 0,
    moved: false,
    twoFinger: false,
    longPressFired: false,
    longPressTimer: null,
    last: null,
    lastTouchCount: 0
  }).current;
  const clearLongPress = () => {
    if (gesture.longPressTimer) {
      clearTimeout(gesture.longPressTimer);
      gesture.longPressTimer = null;
    }
  };
  useEffect6(
    () => () => {
      clearLongPress();
      if (sender.timer) clearTimeout(sender.timer);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const panResponder = useMemo4(
    () => PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt) => {
        gesture.startTime = Date.now();
        gesture.moved = false;
        gesture.longPressFired = false;
        gesture.last = centroid(evt);
        gesture.lastTouchCount = evt.nativeEvent.touches.length;
        gesture.twoFinger = gesture.lastTouchCount >= 2;
        clearLongPress();
        gesture.longPressTimer = setTimeout(() => {
          gesture.longPressTimer = null;
          if (gesture.moved || gesture.twoFinger) return;
          gesture.longPressFired = true;
          flush();
          const { x, y } = pos.current;
          injectRef.current(mouse.contextMenu(Math.round(x), Math.round(y)));
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {
          });
        }, LONG_PRESS_MS);
      },
      onPanResponderMove: (evt, gs) => {
        const count = evt.nativeEvent.touches.length;
        if (count === 0) return;
        const c = centroid(evt);
        if (count !== gesture.lastTouchCount || !gesture.last) {
          gesture.lastTouchCount = count;
          gesture.last = c;
          if (count >= 2) {
            gesture.twoFinger = true;
            clearLongPress();
          }
          return;
        }
        const dx = c.x - gesture.last.x;
        const dy = c.y - gesture.last.y;
        gesture.last = c;
        if (!gesture.moved && Math.hypot(gs.dx, gs.dy) > TAP_SLOP_PT) {
          gesture.moved = true;
          clearLongPress();
        }
        const g = geoRef.current;
        if (count >= 2) {
          sender.scrollDx += -dx / g.scale;
          sender.scrollDy += -dy / g.scale;
          schedule();
          return;
        }
        if (gesture.twoFinger || gesture.longPressFired) return;
        pos.current = {
          x: clamp(pos.current.x + dx / g.scale * ACCELERATION, 0, g.cssWidth - 1),
          y: clamp(pos.current.y + dy / g.scale * ACCELERATION, 0, g.cssHeight - 1)
        };
        updateScreenPos();
        sender.movePending = true;
        schedule();
      },
      onPanResponderRelease: () => {
        clearLongPress();
        flush();
        const isTap = !gesture.twoFinger && !gesture.moved && !gesture.longPressFired && Date.now() - gesture.startTime < LONG_PRESS_MS;
        if (isTap) {
          const { x, y } = pos.current;
          injectRef.current(mouse.click(Math.round(x), Math.round(y)));
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
          });
        }
        gesture.last = null;
      },
      onPanResponderTerminate: () => {
        clearLongPress();
        flush();
        gesture.last = null;
      }
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const icon = cursorIcon(cursor);
  const hx = icon.hx * CURSOR_SIZE;
  const hy = icon.hy * CURSOR_SIZE;
  return /* @__PURE__ */ jsx14(View11, { style: StyleSheet13.absoluteFill, ...panResponder.panHandlers, children: /* @__PURE__ */ jsxs13(
    Animated3.View,
    {
      pointerEvents: "none",
      style: [
        styles13.cursor,
        {
          transform: [
            { translateX: Animated3.subtract(screenX, hx) },
            { translateY: Animated3.subtract(screenY, hy) }
          ]
        }
      ],
      children: [
        OUTLINE_OFFSETS.map(([ox, oy]) => /* @__PURE__ */ jsx14(
          MaterialCommunityIcons,
          {
            name: icon.name,
            size: CURSOR_SIZE,
            color: "#fff",
            style: [styles13.layer, { left: ox, top: oy }]
          },
          `${ox},${oy}`
        )),
        /* @__PURE__ */ jsx14(MaterialCommunityIcons, { name: icon.name, size: CURSOR_SIZE, color: "#000", style: styles13.fill })
      ]
    }
  ) });
}
var OUTLINE_OFFSETS = [
  [-1.5, 0],
  [1.5, 0],
  [0, -1.5],
  [0, 1.5],
  [-1, -1],
  [1, 1],
  [-1, 1],
  [1, -1]
];
var styles13 = StyleSheet13.create({
  cursor: {
    position: "absolute",
    left: 0,
    top: 0,
    width: CURSOR_SIZE,
    height: CURSOR_SIZE,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 }
  },
  layer: {
    position: "absolute"
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0
  }
});

// src/viewport/DesktopViewport.tsx
import { jsx as jsx15, jsxs as jsxs14 } from "react/jsx-runtime";
var TEST_PAGE_HOST = "deskview.local";
var TEST_PAGE_BASE = `https://${TEST_PAGE_HOST}/`;
var ALLOWED_SCHEMES = /* @__PURE__ */ new Set(["http", "https", "about", "data", "blob", "file"]);
var IGNORED_ERROR_CODES = /* @__PURE__ */ new Set([-999, 102]);
function testPageSource(nonce) {
  return { html: TEST_PAGE_HTML, baseUrl: nonce === 0 ? TEST_PAGE_BASE : `${TEST_PAGE_BASE}?r=${nonce}` };
}
function sourceFor(url) {
  return url === TEST_PAGE_URL ? testPageSource(0) : { uri: url };
}
function isTestPageUrl(url) {
  return url.startsWith(TEST_PAGE_BASE) || url === `https://${TEST_PAGE_HOST}`;
}
function publicUrl(url) {
  return isTestPageUrl(url) ? TEST_PAGE_URL : url;
}
function schemeOf(url) {
  const i = url.indexOf(":");
  return i > 0 ? url.slice(0, i).toLowerCase() : "";
}
var nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));
var DesktopViewport = forwardRef(function DesktopViewport2({
  initialUrl,
  resolution,
  scaleMode,
  agent,
  desktopMode,
  inputMode,
  screenshotInfoBar,
  onNavigation,
  onGeometry,
  onPageMessage,
  onError
}, ref) {
  const webRef = useRef6(null);
  const screenRef = useRef6(null);
  const [container, setContainer] = useState6(null);
  const [source, setSource] = useState6(() => sourceFor(initialUrl));
  const sourceRef = useRef6(source);
  sourceRef.current = source;
  const testNonce = useRef6(0);
  const [cursor, setCursor] = useState6("default");
  const [infoMeta, setInfoMeta] = useState6(null);
  const nav = useRef6({
    url: initialUrl,
    title: "",
    canGoBack: false,
    canGoForward: false,
    loading: true,
    progress: 0
  });
  const cb = useRef6({ onNavigation, onGeometry, onPageMessage, onError });
  cb.current = { onNavigation, onGeometry, onPageMessage, onError };
  const geometry = useMemo5(
    () => container ? computeGeometry(container.width, container.height, resolution, scaleMode) : null,
    [container, resolution, scaleMode]
  );
  const geoRef = useRef6(geometry);
  geoRef.current = geometry;
  const cssWidth = geometry?.cssWidth ?? 0;
  const cssHeight = geometry?.cssHeight ?? 0;
  const inject = useCallback5((script) => {
    webRef.current?.injectJavaScript(script);
  }, []);
  const onLayout = useCallback5((e) => {
    const { width, height } = e.nativeEvent.layout;
    setContainer(
      (prev) => prev && Math.abs(prev.width - width) < 0.5 && Math.abs(prev.height - height) < 0.5 ? prev : { width, height }
    );
  }, []);
  useEffect7(() => {
    if (geometry) cb.current.onGeometry?.(geometry);
  }, [geometry]);
  const beforeContentScript = useMemo5(
    () => cssWidth > 0 ? buildBeforeContentScript({ screen: { width: cssWidth, height: cssHeight }, agent, desktopMode }) : "",
    [cssWidth, cssHeight, agent, desktopMode]
  );
  const lastSize = useRef6(null);
  useEffect7(() => {
    if (cssWidth <= 0) return;
    const key = `${cssWidth}x${cssHeight}`;
    if (lastSize.current !== null && lastSize.current !== key) {
      inject(buildScreenUpdateCall({ width: cssWidth, height: cssHeight }) + buildInfoRequestCall());
    }
    lastSize.current = key;
  }, [cssWidth, cssHeight, inject]);
  const reloadPage = useCallback5(() => {
    if (nav.current.url === TEST_PAGE_URL) {
      testNonce.current += 1;
      setSource(testPageSource(testNonce.current));
      return;
    }
    webRef.current?.reload();
  }, []);
  const envKey = `${agent.id}|${agent.userAgent}|${desktopMode}`;
  const lastEnv = useRef6(envKey);
  useEffect7(() => {
    if (lastEnv.current === envKey) return;
    lastEnv.current = envKey;
    const t = setTimeout(reloadPage, 60);
    return () => clearTimeout(t);
  }, [envKey, reloadPage]);
  const lastMode = useRef6(inputMode);
  useEffect7(() => {
    if (lastMode.current === "mouse" && inputMode !== "mouse") {
      inject(mouse.leave());
      setCursor("default");
    }
    lastMode.current = inputMode;
  }, [inputMode, inject]);
  const emitNav = useCallback5((patch) => {
    nav.current = { ...nav.current, ...patch };
    cb.current.onNavigation(nav.current);
  }, []);
  const load = useCallback5(
    (url) => {
      if (url === TEST_PAGE_URL) {
        testNonce.current += 1;
        setSource(testPageSource(testNonce.current));
        return;
      }
      if (url === nav.current.url) {
        webRef.current?.reload();
        return;
      }
      const prev = sourceRef.current;
      if ("uri" in prev && prev.uri === url) {
        inject(`window.location.href = ${JSON.stringify(url)}; true;`);
        return;
      }
      setSource({ uri: url });
    },
    [inject]
  );
  useImperativeHandle(
    ref,
    () => ({
      load,
      goBack: () => webRef.current?.goBack(),
      goForward: () => webRef.current?.goForward(),
      reload: reloadPage,
      stop: () => {
        webRef.current?.stopLoading();
        emitNav({ loading: false });
      },
      captureScreenshot: async (meta) => {
        const g = geoRef.current;
        if (!g) throw new Error("Viewport ist noch nicht bereit.");
        const barHeight = screenshotInfoBar ? INFO_BAR_HEIGHT : 0;
        if (barHeight > 0) setInfoMeta(meta);
        try {
          await nextFrame();
          await nextFrame();
          const ratio = PixelRatio.get();
          const uri = await captureRef(screenRef, {
            format: "png",
            quality: 1,
            result: "tmpfile",
            width: g.cssWidth / ratio,
            height: (g.cssHeight + barHeight) / ratio
          });
          return uri.startsWith("/") ? `file://${uri}` : uri;
        } finally {
          if (barHeight > 0) setInfoMeta(null);
        }
      }
    }),
    [load, emitNav, reloadPage, screenshotInfoBar]
  );
  const handleShouldStart = useCallback5(
    (req) => {
      const scheme = schemeOf(req.url);
      if (ALLOWED_SCHEMES.has(scheme)) return true;
      const topFrame = req.isTopFrame !== false;
      if (req.url === TEST_PAGE_URL) {
        if (topFrame) load(TEST_PAGE_URL);
        return false;
      }
      if (topFrame && scheme) Linking.openURL(req.url).catch(() => {
      });
      return false;
    },
    [load]
  );
  const handleLoadStart = useCallback5(
    (e) => {
      cb.current.onError?.(null);
      const n = e.nativeEvent;
      emitNav({ url: publicUrl(n.url), loading: true, progress: Math.max(0.05, nav.current.loading ? nav.current.progress : 0) });
    },
    [emitNav]
  );
  const handleProgress = useCallback5(
    (e) => {
      const n = e.nativeEvent;
      emitNav({
        progress: n.progress,
        canGoBack: n.canGoBack,
        canGoForward: n.canGoForward,
        loading: n.progress < 1
      });
    },
    [emitNav]
  );
  const handleLoadEnd = useCallback5(
    (e) => {
      const n = e.nativeEvent;
      emitNav({
        url: publicUrl(n.url),
        title: n.title || nav.current.title,
        canGoBack: n.canGoBack,
        canGoForward: n.canGoForward,
        loading: false,
        progress: 1
      });
    },
    [emitNav]
  );
  const handleStateChange = useCallback5(
    (n) => {
      emitNav({
        url: publicUrl(n.url),
        title: n.title ?? nav.current.title,
        canGoBack: n.canGoBack,
        canGoForward: n.canGoForward,
        loading: n.loading
      });
    },
    [emitNav]
  );
  const handleError = useCallback5((e) => {
    const { code, description } = e.nativeEvent;
    if (IGNORED_ERROR_CODES.has(code)) return;
    cb.current.onError?.(description || `Fehler ${code}`);
  }, []);
  const handleHttpError = useCallback5((e) => {
    const { statusCode, description } = e.nativeEvent;
    cb.current.onError?.(`HTTP ${statusCode}${description ? ` – ${description}` : ""}`);
  }, []);
  const handleMessage = useCallback5((e) => {
    let msg;
    try {
      msg = JSON.parse(e.nativeEvent.data);
    } catch {
      return;
    }
    if (!msg || typeof msg !== "object" || typeof msg.type !== "string") return;
    if (msg.type === "cursor") setCursor(msg.cursor || "default");
    cb.current.onPageMessage?.(msg);
  }, []);
  const lastTerminate = useRef6(0);
  const handleTerminate = useCallback5(() => {
    const now = Date.now();
    const repeated = now - lastTerminate.current < 2e4;
    lastTerminate.current = now;
    if (repeated) {
      emitNav({ loading: false });
      cb.current.onError?.("Die Seite ist abgestürzt (zu wenig Arbeitsspeicher). Wähle eine kleinere Bildschirmgröße.");
      return;
    }
    reloadPage();
  }, [emitNav, reloadPage]);
  const screenHeight = cssHeight + (infoMeta ? INFO_BAR_HEIGHT : 0);
  return /* @__PURE__ */ jsxs14(View12, { style: styles14.container, onLayout, children: [
    geometry && /* @__PURE__ */ jsxs14(
      View12,
      {
        ref: screenRef,
        collapsable: false,
        style: [
          styles14.screen,
          {
            left: geometry.offsetX,
            top: geometry.offsetY,
            width: cssWidth,
            height: screenHeight,
            transform: [{ scale: geometry.scale }],
            transformOrigin: "top left"
          }
        ],
        children: [
          /* @__PURE__ */ jsx15(
            WebView,
            {
              ref: webRef,
              style: [styles14.web, { width: cssWidth, height: cssHeight }],
              containerStyle: { width: cssWidth, height: cssHeight, flex: 0 },
              source,
              userAgent: agent.userAgent,
              contentMode: "desktop",
              injectedJavaScriptBeforeContentLoaded: beforeContentScript,
              injectedJavaScriptBeforeContentLoadedForMainFrameOnly: false,
              allowsBackForwardNavigationGestures: inputMode === "touch",
              allowsInlineMediaPlayback: true,
              sharedCookiesEnabled: true,
              keyboardDisplayRequiresUserAction: false,
              allowsLinkPreview: false,
              webviewDebuggingEnabled: true,
              setSupportMultipleWindows: false,
              originWhitelist: ["*"],
              automaticallyAdjustContentInsets: false,
              contentInsetAdjustmentBehavior: "never",
              decelerationRate: "normal",
              onShouldStartLoadWithRequest: handleShouldStart,
              onLoadStart: handleLoadStart,
              onLoadProgress: handleProgress,
              onLoadEnd: handleLoadEnd,
              onNavigationStateChange: handleStateChange,
              onError: handleError,
              onHttpError: handleHttpError,
              onMessage: handleMessage,
              onContentProcessDidTerminate: handleTerminate
            }
          ),
          infoMeta && /* @__PURE__ */ jsx15(InfoBar, { meta: infoMeta, width: cssWidth })
        ]
      }
    ),
    geometry && inputMode === "mouse" && /* @__PURE__ */ jsx15(TrackpadOverlay, { geometry, cursor, inject })
  ] });
});
var styles14 = StyleSheet14.create({
  container: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#111"
  },
  screen: {
    position: "absolute",
    backgroundColor: "#fff"
  },
  web: {
    flex: 0,
    backgroundColor: "#fff"
  }
});

// src/screens/BrowserScreen.tsx
import { jsx as jsx16, jsxs as jsxs15 } from "react/jsx-runtime";
var LANDSCAPE_HINT_WIDTH = 1440;
function errorText(e) {
  return e instanceof Error ? e.message : String(e);
}
function resolutionLabel(r) {
  return findPreset(r)?.label ?? "Eigene Größe";
}
function BrowserScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const dims = useWindowDimensions();
  const { settings, siteProfiles, hints, updateSettings, setSiteProfile, setHint } = useAppState();
  const viewportRef = useRef7(null);
  const [initialUrl] = useState7(settings.homeUrl);
  const [nav, setNav] = useState7({
    url: initialUrl,
    title: "",
    canGoBack: false,
    canGoForward: false,
    loading: true,
    progress: 0
  });
  const [geometry, setGeometry] = useState7(null);
  const [inputMode, setInputMode] = useState7("touch");
  const [error, setError] = useState7(null);
  const [fullscreen, setFullscreen] = useState7(false);
  const [sheet, setSheet] = useState7(null);
  const [introOpen, setIntroOpen] = useState7(!settings.onboardingDone);
  const [trackpadHintOpen, setTrackpadHintOpen] = useState7(false);
  const [capturing, setCapturing] = useState7(false);
  const [toast, setToast] = useState7(null);
  const toastId = useRef7(0);
  const agent = useMemo6(() => getAgent(settings.agentId), [settings.agentId]);
  const host = useMemo6(() => hostOf(nav.url), [nav.url]);
  const profile = host ? siteProfiles[host] : void 0;
  const resolution = profile?.resolution ?? settings.resolution;
  const scaleMode = profile?.scaleMode ?? settings.scaleMode;
  const showToast = useCallback6((data) => {
    toastId.current += 1;
    setToast({ ...data, id: toastId.current });
  }, []);
  const hideToast = useCallback6(() => setToast(null), []);
  const lastHost = useRef7(null);
  useEffect8(() => {
    if (host === lastHost.current) return;
    lastHost.current = host;
    const p = host ? siteProfiles[host] : void 0;
    if (host && p) {
      showToast({ message: `Profil für ${host}: ${findPreset(p.resolution)?.label ?? formatResolution(p.resolution)}` });
    }
  }, [host]);
  const navigate = useCallback6((url) => {
    setError(null);
    viewportRef.current?.load(url);
  }, []);
  const goBack = useCallback6(() => viewportRef.current?.goBack(), []);
  const goForward = useCallback6(() => viewportRef.current?.goForward(), []);
  const reload = useCallback6(() => {
    setError(null);
    viewportRef.current?.reload();
  }, []);
  const stop = useCallback6(() => viewportRef.current?.stop(), []);
  const toggleMouse = useCallback6(() => {
    const next = inputMode === "mouse" ? "touch" : "mouse";
    setInputMode(next);
    Haptics2.selectionAsync().catch(() => void 0);
    if (next === "mouse" && !hints.trackpadHintSeen) setTrackpadHintOpen(true);
  }, [inputMode, hints.trackpadHintSeen]);
  const dismissTrackpadHint = useCallback6(() => {
    setTrackpadHintOpen(false);
    setHint("trackpadHintSeen");
  }, [setHint]);
  const buildMeta = useCallback6(
    () => ({
      url: nav.url,
      title: nav.title,
      resolution: geometry ? { width: geometry.cssWidth, height: geometry.cssHeight } : resolution,
      agentLabel: agent.label,
      takenAt: /* @__PURE__ */ new Date()
    }),
    [nav.url, nav.title, geometry, resolution, agent.label]
  );
  const copyInfo = useCallback6(
    async (meta) => {
      try {
        await Clipboard.setStringAsync(describeScreenshot(meta));
        Haptics2.notificationAsync(Haptics2.NotificationFeedbackType.Success).catch(() => void 0);
        showToast({ message: "Info kopiert" });
      } catch (e) {
        Alert.alert("Kopieren nicht möglich", errorText(e));
      }
    },
    [showToast]
  );
  const takeScreenshot = useCallback6(async () => {
    const viewport = viewportRef.current;
    if (capturing || !viewport) return;
    setCapturing(true);
    const meta = buildMeta();
    let uri;
    try {
      uri = await viewport.captureScreenshot(meta);
    } catch (e) {
      setCapturing(false);
      Alert.alert("Screenshot fehlgeschlagen", `Die Seite konnte nicht aufgenommen werden.

${errorText(e)}`);
      return;
    }
    Haptics2.notificationAsync(Haptics2.NotificationFeedbackType.Success).catch(() => void 0);
    try {
      await shareScreenshot(uri, meta);
      showToast({ message: "Screenshot erstellt", action: { label: "Info kopieren", onPress: () => void copyInfo(meta) } });
    } catch (e) {
      Alert.alert("Teilen nicht möglich", errorText(e));
    } finally {
      setCapturing(false);
    }
  }, [capturing, buildMeta, showToast, copyInfo]);
  const copyPageInfo = useCallback6(() => {
    setSheet(null);
    void copyInfo(buildMeta());
  }, [copyInfo, buildMeta]);
  const selectResolution = useCallback6(
    (r) => {
      Haptics2.selectionAsync().catch(() => void 0);
      if (host && profile) setSiteProfile(host, { ...profile, resolution: r });
      else updateSettings({ resolution: r });
    },
    [host, profile, setSiteProfile, updateSettings]
  );
  const selectScaleMode = useCallback6(
    (mode) => {
      Haptics2.selectionAsync().catch(() => void 0);
      if (host && profile) setSiteProfile(host, { ...profile, scaleMode: mode });
      else updateSettings({ scaleMode: mode });
    },
    [host, profile, setSiteProfile, updateSettings]
  );
  const toggleProfile = useCallback6(
    (remember) => {
      if (!host) return;
      setSiteProfile(host, remember ? { host, resolution, scaleMode } : null);
    },
    [host, resolution, scaleMode, setSiteProfile]
  );
  const enterFullscreen = useCallback6(() => setFullscreen(true), []);
  const exitFullscreen = useCallback6(() => setFullscreen(false), []);
  const portrait = dims.height > dims.width;
  const landscapeHintVisible = !hints.landscapeHintSeen && settings.onboardingDone && !introOpen && portrait && resolution.width >= LANDSCAPE_HINT_WIDTH;
  const landscapeHintShown = useRef7(false);
  useEffect8(() => {
    if (landscapeHintVisible) landscapeHintShown.current = true;
    else if (landscapeHintShown.current && !portrait) setHint("landscapeHintSeen");
  }, [landscapeHintVisible, portrait, setHint]);
  const dismissLandscapeHint = useCallback6(() => setHint("landscapeHintSeen"), [setHint]);
  const finishIntro = useCallback6(() => {
    setIntroOpen(false);
    if (!settings.onboardingDone) updateSettings({ onboardingDone: true });
  }, [settings.onboardingDone, updateSettings]);
  const showIntro = useCallback6(() => {
    setTimeout(() => setIntroOpen(true), 600);
  }, []);
  const closeSheet = useCallback6(() => setSheet(null), []);
  const openResolution = useCallback6(() => setSheet("resolution"), []);
  const openSettings = useCallback6(() => setSheet("settings"), []);
  const openBookmarks = useCallback6(() => setSheet("bookmarks"), []);
  const sizeText = geometry ? scaleMode === "fill" ? `${geometry.cssWidth} px breit · ${formatScale(geometry.scale)}` : `${formatResolution({ width: geometry.cssWidth, height: geometry.cssHeight })} · ${formatScale(geometry.scale)}` : formatResolution(resolution);
  return /* @__PURE__ */ jsxs15(
    View13,
    {
      style: [
        styles15.root,
        {
          backgroundColor: fullscreen ? colors.viewportBackground : colors.chrome,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right
        }
      ],
      children: [
        /* @__PURE__ */ jsx16(StatusBar, { hidden: fullscreen, style: "auto", animated: true }),
        !fullscreen ? /* @__PURE__ */ jsx16(
          AddressBar,
          {
            url: nav.url,
            loading: nav.loading,
            progress: nav.progress,
            searchEngine: settings.searchEngine,
            onNavigate: navigate,
            onReload: reload,
            onStop: stop
          }
        ) : null,
        /* @__PURE__ */ jsxs15(View13, { style: [styles15.viewport, { backgroundColor: colors.viewportBackground }], children: [
          /* @__PURE__ */ jsx16(
            DesktopViewport,
            {
              ref: viewportRef,
              initialUrl,
              resolution,
              scaleMode,
              agent,
              desktopMode: settings.desktopMode,
              inputMode,
              screenshotInfoBar: settings.screenshotInfoBar,
              onNavigation: setNav,
              onGeometry: setGeometry,
              onError: setError
            }
          ),
          /* @__PURE__ */ jsxs15(View13, { style: StyleSheet15.absoluteFill, pointerEvents: "box-none", children: [
            /* @__PURE__ */ jsx16(
              SizeChip,
              {
                label: resolutionLabel(resolution),
                sizeText,
                profileActive: !!profile,
                autoHide: fullscreen,
                onPress: openResolution
              }
            ),
            error ? /* @__PURE__ */ jsx16(View13, { style: styles15.center, pointerEvents: "box-none", children: /* @__PURE__ */ jsx16(
              InfoCard,
              {
                icon: "cloud-offline-outline",
                tone: "error",
                title: "Seite konnte nicht geladen werden",
                message: error,
                onClose: () => setError(null),
                actions: [{ label: "Erneut versuchen", onPress: reload, primary: true }],
                style: styles15.card
              }
            ) }) : null,
            landscapeHintVisible && !error && !toast ? /* @__PURE__ */ jsx16(View13, { style: styles15.bottom, pointerEvents: "box-none", children: /* @__PURE__ */ jsx16(
              InfoCard,
              {
                icon: "phone-landscape-outline",
                title: "Tipp: Dreh dein iPhone quer",
                message: "So wirkt der große Bildschirm natürlicher und Text wird größer.",
                onClose: dismissLandscapeHint,
                style: styles15.card
              }
            ) }) : null,
            /* @__PURE__ */ jsx16(Toast, { toast, onHide: hideToast })
          ] }),
          fullscreen ? /* @__PURE__ */ jsx16(
            Pressable12,
            {
              onPress: exitFullscreen,
              hitSlop: 8,
              accessibilityRole: "button",
              accessibilityLabel: "Vollbild beenden",
              style: [styles15.exitFullscreen, { backgroundColor: colors.chipBackground }],
              children: /* @__PURE__ */ jsx16(Ionicons11, { name: "contract-outline", size: 20, color: colors.chipText })
            }
          ) : null
        ] }),
        !fullscreen ? /* @__PURE__ */ jsx16(View13, { style: { backgroundColor: colors.chrome, paddingBottom: Math.max(insets.bottom - spacing.sm, spacing.xs) }, children: /* @__PURE__ */ jsx16(
          Toolbar,
          {
            canGoBack: nav.canGoBack,
            canGoForward: nav.canGoForward,
            inputMode,
            capturing,
            onBack: goBack,
            onForward: goForward,
            onToggleMouse: toggleMouse,
            onScreenshot: takeScreenshot,
            onBookmarks: openBookmarks,
            onFullscreen: enterFullscreen,
            onMore: openSettings
          }
        ) }) : null,
        trackpadHintOpen ? /* @__PURE__ */ jsx16(TrackpadHint, { onDismiss: dismissTrackpadHint }) : null,
        /* @__PURE__ */ jsx16(
          ResolutionSheet,
          {
            visible: sheet === "resolution",
            onClose: closeSheet,
            resolution,
            scaleMode,
            host,
            profileActive: !!profile,
            onSelectResolution: selectResolution,
            onSelectScaleMode: selectScaleMode,
            onToggleProfile: toggleProfile
          }
        ),
        /* @__PURE__ */ jsx16(
          SettingsSheet,
          {
            visible: sheet === "settings",
            onClose: closeSheet,
            currentUrl: nav.url,
            onOpenUrl: navigate,
            onCopyPageInfo: copyPageInfo,
            onShowIntro: showIntro
          }
        ),
        /* @__PURE__ */ jsx16(
          BookmarksSheet,
          {
            visible: sheet === "bookmarks",
            onClose: closeSheet,
            currentUrl: nav.url,
            currentTitle: nav.title,
            onOpen: navigate
          }
        ),
        /* @__PURE__ */ jsx16(OnboardingSheet, { visible: introOpen && sheet === null, onDone: finishIntro })
      ]
    }
  );
}
var styles15 = StyleSheet15.create({
  root: { flex: 1 },
  viewport: { flex: 1, overflow: "hidden" },
  center: { ...StyleSheet15.absoluteFill, alignItems: "center", justifyContent: "center", padding: spacing.lg },
  bottom: { position: "absolute", left: 0, right: 0, bottom: spacing.lg, alignItems: "center", paddingHorizontal: spacing.lg },
  card: { width: "100%", maxWidth: 420 },
  exitFullscreen: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: HIT,
    height: HIT,
    borderRadius: HIT / 2,
    alignItems: "center",
    justifyContent: "center"
  }
});

// App.tsx
import { jsx as jsx17, jsxs as jsxs16 } from "react/jsx-runtime";
function Root() {
  const { ready } = useAppState();
  const { colors } = useTheme();
  if (!ready) return /* @__PURE__ */ jsx17(View14, { style: { flex: 1, backgroundColor: colors.chrome } });
  return /* @__PURE__ */ jsx17(BrowserScreen, {});
}
function App() {
  useEffect9(() => {
    ScreenOrientation.unlockAsync().catch(() => void 0);
  }, []);
  return /* @__PURE__ */ jsx17(SafeAreaProvider, { children: /* @__PURE__ */ jsxs16(AppStateProvider, { children: [
    /* @__PURE__ */ jsx17(StatusBar2, { style: "auto" }),
    /* @__PURE__ */ jsx17(Root, {})
  ] }) });
}
export {
  App as default
};
