// STUB – implemented by work package A.
// All builders return plain JavaScript source strings for react-native-webview.
import type { AgentProfile, Resolution } from '../../types';

export interface InjectionOptions {
  /** Virtual screen size reported via screen.width/height (the CSS viewport size). */
  screen: Resolution;
  agent: AgentProfile;
  desktopMode: boolean;
}

/**
 * Script for `injectedJavaScriptBeforeContentLoaded` (with
 * `injectedJavaScriptBeforeContentLoadedForMainFrameOnly={false}`).
 * Contains: viewport-meta override (top frame only), desktop environment (if enabled),
 * mouse engine `window.__dv` (top frame only), info reporter posting PageMessage 'info'.
 * Must be idempotent and end with `true;`.
 */
export function buildBeforeContentScript(options: InjectionOptions): string {
  throw new Error('not implemented');
}

/** Updates spoofed screen size of the current page without reload. Ends with `true;`. */
export function buildScreenUpdateCall(screen: Resolution): string {
  throw new Error('not implemented');
}

/** Asks the page to post a fresh 'info' message. Ends with `true;`. */
export function buildInfoRequestCall(): string {
  throw new Error('not implemented');
}

/**
 * Commands for the mouse engine. Coordinates are CSS px relative to the viewport
 * (clientX/clientY). Each returns a script string ending with `true;`.
 *  move: dispatches pointer/mouse move + over/out/enter/leave, updates emulated :hover,
 *        posts PageMessage 'cursor' when the CSS cursor under the pointer changes.
 *  click: pointerdown/mousedown/pointerup/mouseup/click at the position; focuses
 *        inputs/textareas/selects/contenteditable; follows links naturally via click().
 *  contextMenu: dispatches 'contextmenu' (right click, button 2).
 *  scroll: scrolls the nearest scrollable ancestor under (x, y) (or the document) by dx, dy
 *        and dispatches a 'wheel' event.
 *  leave: removes hover state (cursor left the page / mouse mode off).
 */
export const mouse = {
  move(x: number, y: number): string {
    throw new Error('not implemented');
  },
  click(x: number, y: number): string {
    throw new Error('not implemented');
  },
  contextMenu(x: number, y: number): string {
    throw new Error('not implemented');
  },
  scroll(x: number, y: number, dx: number, dy: number): string {
    throw new Error('not implemented');
  },
  leave(): string {
    throw new Error('not implemented');
  },
};
