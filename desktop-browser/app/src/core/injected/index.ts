// Builders for the JavaScript injected into the WebView (work package A).
// All builders return plain JavaScript source strings for react-native-webview.
import type { AgentProfile, Resolution } from '../../types';
import { buildDesktopEnvScript } from './desktopEnv';
import { buildInfoReporterScript } from './infoReporter';
import { buildMouseEngineScript } from './mouseEngine';
import { jsInt, jsNum } from './shared';
import { buildViewportScript } from './viewport';

export { HOVER_ATTR, HOVER_STYLE_ID } from './mouseEngine';
export { MQ_FALSE, MQ_TRUE } from './shared';
export { VIEWPORT_CONTENT } from './viewport';

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
  const parts = [buildViewportScript()];
  if (options.desktopMode) parts.push(buildDesktopEnvScript(options.screen, options.agent));
  parts.push(buildMouseEngineScript(), buildInfoReporterScript());
  return parts.join('') + 'true;';
}

/** Updates spoofed screen size of the current page without reload. Ends with `true;`. */
export function buildScreenUpdateCall(screen: Resolution): string {
  const w = jsInt(screen?.width, 1920);
  const h = jsInt(screen?.height, 1080);
  return `try{window.__dvSetScreen&&window.__dvSetScreen(${w},${h});window.__dvRequestInfo&&window.__dvRequestInfo();}catch(e){}true;`;
}

/** Asks the page to post a fresh 'info' message. Ends with `true;`. */
export function buildInfoRequestCall(): string {
  return 'try{window.__dvRequestInfo&&window.__dvRequestInfo();}catch(e){}true;';
}

function call(method: string, args: number[]): string {
  return `try{window.__dv && window.__dv.${method}(${args.map(jsNum).join(',')});}catch(e){}true;`;
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
    return call('move', [x, y]);
  },
  click(x: number, y: number): string {
    return call('click', [x, y]);
  },
  contextMenu(x: number, y: number): string {
    return call('contextMenu', [x, y]);
  },
  scroll(x: number, y: number, dx: number, dy: number): string {
    return call('scroll', [x, y, dx, dy]);
  },
  leave(): string {
    return call('leave', []);
  },
};
