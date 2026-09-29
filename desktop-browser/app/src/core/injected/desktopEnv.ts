import type { AgentProfile, Resolution } from '../../types';
import { REWRITE_MEDIA_JS, iife, jsInt } from './shared';

/**
 * All frames: makes the page see a desktop environment — screen size, outer window size,
 * navigator.platform/vendor/userAgent, no touch support, hover/pointer media queries.
 * Installs the hidden updater window.__dvSetScreen(w, h).
 */
export function buildDesktopEnvScript(screen: Resolution, agent: AgentProfile): string {
  const appVersion = agent.userAgent.replace(/^Mozilla\//, '');
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
