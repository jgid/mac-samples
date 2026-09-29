// Shared types and contracts between all modules. Change only with care: every
// work package (core, ui, viewport, tooling) depends on these definitions.

export interface Resolution {
  width: number;
  height: number;
}

/** 'fill' = width fixed, height follows the phone display; 'exact' = letterboxed. */
export type ScaleMode = 'fill' | 'exact';

export type PresetGroup = 'laptop' | 'desktop' | 'large';

export interface Preset {
  id: string;
  /** Human device name, e.g. "MacBook Air 13″". */
  label: string;
  /** Short explanation, e.g. "Typischer Laptop". */
  detail: string;
  group: PresetGroup;
  width: number;
  height: number;
}

export type AgentId = 'safari-mac' | 'chrome-mac' | 'chrome-win' | 'edge-win' | 'firefox-win';

export interface AgentProfile {
  id: AgentId;
  /** e.g. "Safari auf Mac" */
  label: string;
  userAgent: string;
  /** navigator.platform */
  platform: string;
  /** navigator.vendor */
  vendor: string;
}

export type SearchEngineId = 'duckduckgo' | 'google' | 'bing' | 'ecosia';

export type InputMode = 'touch' | 'mouse';

export interface Settings {
  resolution: Resolution;
  scaleMode: ScaleMode;
  agentId: AgentId;
  /** Spoof desktop environment (screen, platform, touch, hover media queries). */
  desktopMode: boolean;
  searchEngine: SearchEngineId;
  /** Start page; TEST_PAGE_URL for the built-in test page. */
  homeUrl: string;
  /** Burn an info bar (URL, size, agent, time) into screenshots. */
  screenshotInfoBar: boolean;
  onboardingDone: boolean;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  createdAt: number;
}

/** Remembered per-host viewport configuration. */
export interface SiteProfile {
  host: string;
  resolution: Resolution;
  scaleMode: ScaleMode;
}

/** Result of fitting the virtual screen into the available phone area. */
export interface ViewportGeometry {
  /** Layout size of the web view in CSS px (what the page sees as innerWidth/innerHeight). */
  cssWidth: number;
  cssHeight: number;
  /** Factor from CSS px to phone points. */
  scale: number;
  /** Position of the scaled screen inside the container, in phone points. */
  offsetX: number;
  offsetY: number;
}

/** Messages posted by injected scripts via window.ReactNativeWebView.postMessage(JSON). */
export type PageMessage =
  | {
      type: 'info';
      url: string;
      title: string;
      innerWidth: number;
      innerHeight: number;
      screenWidth: number;
      screenHeight: number;
      devicePixelRatio: number;
    }
  | {
      type: 'cursor';
      /** CSS cursor under the virtual mouse, e.g. 'pointer', 'text', 'default'. */
      cursor: string;
    };

export interface NavigationInfo {
  url: string;
  title: string;
  canGoBack: boolean;
  canGoForward: boolean;
  loading: boolean;
  /** 0..1 */
  progress: number;
}

export interface ScreenshotMeta {
  url: string;
  title: string;
  resolution: Resolution;
  agentLabel: string;
  takenAt: Date;
}
