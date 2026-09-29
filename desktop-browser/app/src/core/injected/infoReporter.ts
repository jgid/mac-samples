import { IS_TOP_JS, POST_JS, iife } from './shared';

/** Top frame only: posts PageMessage 'info' on DOMContentLoaded, load, resize and on request. */
export function buildInfoReporterScript(): string {
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
