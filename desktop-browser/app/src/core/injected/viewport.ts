import { IS_TOP_JS, iife } from './shared';

export const VIEWPORT_CONTENT = 'width=device-width, initial-scale=1';

/**
 * Top frame only: inserts our own viewport meta at document start and neutralizes any
 * viewport meta the page provides (desktop browsers ignore it).
 */
export function buildViewportScript(): string {
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
