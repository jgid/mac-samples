// Shared JS snippets for the injected scripts. Everything here is page-side
// JavaScript source (ES5-ish, no transpilation), embedded into strings.

/** Wraps a script body in an IIFE with try/catch so failures never break the page. */
export function iife(body: string): string {
  return `(function(){try{\n${body}\n}catch(__dvErr){}})();\n`;
}

/** Declares `isTop` (true in the top-level browsing context). */
export const IS_TOP_JS = `var isTop = true; try { isTop = window.self === window.top; } catch (e) { isTop = false; }`;

/** Media query values used to force a query to match / not match. */
export const MQ_TRUE = '(min-width: 0px)';
export const MQ_FALSE = '(max-width: 0px) and (min-width: 1px)';

/**
 * Declares `dvRewriteMedia(query)`: rewrites hover/pointer media features to what a desktop
 * browser with a mouse reports (hover: hover, pointer: fine).
 */
export const REWRITE_MEDIA_JS = `
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

/** Declares `dvPost(msg)`: posts a JSON message to React Native (no-op outside the app). */
export const POST_JS = `
function dvPost(msg) {
  try {
    var rn = window.ReactNativeWebView;
    if (rn && typeof rn.postMessage === 'function') rn.postMessage(JSON.stringify(msg));
  } catch (e) {}
}
`;

/** Formats a number for embedding into JS source: finite, rounded to 0.1, else 0. */
export function jsNum(v: number): string {
  if (typeof v !== 'number' || !Number.isFinite(v)) return '0';
  const r = Math.round(v * 10) / 10;
  return String(Object.is(r, -0) ? 0 : r);
}

/** Positive integer for embedding (screen sizes). */
export function jsInt(v: number, fallback: number): string {
  if (typeof v !== 'number' || !Number.isFinite(v) || v <= 0) return String(fallback);
  return String(Math.round(v));
}
