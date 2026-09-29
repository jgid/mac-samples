import { IS_TOP_JS, POST_JS, REWRITE_MEDIA_JS, iife } from './shared';

export const HOVER_ATTR = 'data-dv-hover';
export const HOVER_STYLE_ID = '__dv-hover-style';

/**
 * Top frame only: installs the mouse engine `window.__dv` (idempotent).
 * API: move(x, y), click(x, y), contextMenu(x, y), scroll(x, y, dx, dy), leave(), rescan().
 */
export function buildMouseEngineScript(): string {
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
