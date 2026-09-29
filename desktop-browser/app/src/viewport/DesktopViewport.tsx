// STUB – implemented by work package C. Props and handle are the contract used by the UI.
import { forwardRef } from 'react';
import type {
  AgentProfile,
  InputMode,
  NavigationInfo,
  PageMessage,
  Resolution,
  ScaleMode,
  ScreenshotMeta,
  ViewportGeometry,
} from '../types';

export interface DesktopViewportHandle {
  /** Loads a URL; TEST_PAGE_URL renders the built-in test page. */
  load(url: string): void;
  goBack(): void;
  goForward(): void;
  reload(): void;
  stop(): void;
  /** Captures the virtual screen at its real CSS size (plus info bar if enabled); returns a file URI. */
  captureScreenshot(meta: ScreenshotMeta): Promise<string>;
}

export interface DesktopViewportProps {
  initialUrl: string;
  resolution: Resolution;
  scaleMode: ScaleMode;
  agent: AgentProfile;
  desktopMode: boolean;
  inputMode: InputMode;
  /** Render the info bar below the page while capturing screenshots. */
  screenshotInfoBar: boolean;
  onNavigation(info: NavigationInfo): void;
  onGeometry?(geometry: ViewportGeometry): void;
  onPageMessage?(message: PageMessage): void;
  /** Error text for failed loads, null when cleared. */
  onError?(message: string | null): void;
}

export const DesktopViewport = forwardRef<DesktopViewportHandle, DesktopViewportProps>(function DesktopViewport() {
  return null;
});
