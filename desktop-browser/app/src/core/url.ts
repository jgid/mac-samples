// Address bar logic: input → URL, search engines, display forms (work package A).
import type { SearchEngineId } from '../types';

/** Pseudo URL of the built-in viewport test page. */
export const TEST_PAGE_URL = 'deskview://test';

export const SEARCH_ENGINES: { id: SearchEngineId; label: string }[] = [
  { id: 'duckduckgo', label: 'DuckDuckGo' },
  { id: 'google', label: 'Google' },
  { id: 'bing', label: 'Bing' },
  { id: 'ecosia', label: 'Ecosia' },
];

const SEARCH_URLS: Record<SearchEngineId, string> = {
  duckduckgo: 'https://duckduckgo.com/?q=',
  google: 'https://www.google.com/search?q=',
  bing: 'https://www.bing.com/search?q=',
  ecosia: 'https://www.ecosia.org/search?q=',
};

/** Search URL for a query with the given engine (unknown engines fall back to DuckDuckGo). */
export function searchUrl(query: string, engine: SearchEngineId): string {
  const base = SEARCH_URLS[engine] ?? SEARCH_URLS.duckduckgo;
  return base + encodeURIComponent(query);
}

const PASSTHROUGH = /^(https?:\/\/|about:|data:)/i;
// host[:port][/path|?query|#hash]
const HOST_LIKE = /^(\[[0-9a-f:.]+\]|[^\s/?#:@[\]]+)(:(\d{1,5}))?([/?#].*)?$/i;
const IPV4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
const DOMAIN = /^(?=.{1,253}$)([a-z0-9¡-￿]([a-z0-9¡-￿-]{0,61}[a-z0-9¡-￿])?\.)+([a-z¡-￿]{2,63}|xn--[a-z0-9-]{1,59})$/i;
const LOCAL_SUFFIX = /\.(box|local|lan|home|internal|localdomain)$/i;

/** True for hosts that are usually only reachable via plain http (local network). */
export function isLocalHost(host: string): boolean {
  const h = host.toLowerCase();
  return h === 'localhost' || h.endsWith('.localhost') || IPV4.test(h) || h.startsWith('[') || LOCAL_SUFFIX.test(h);
}

/**
 * Turns address bar input into a loadable URL:
 * - '' → null
 * - 'deskview://test' → TEST_PAGE_URL
 * - http(s)/about/data URLs unchanged
 * - host-like input ('example.com', 'localhost:3000', '192.168.178.1', 'fritz.box')
 *   → 'https://…' (but 'http://' for localhost, IPs and *.box / *.local / *.lan hosts)
 * - everything else → search URL of the engine
 */
export function resolveInput(input: string, engine: SearchEngineId): string | null {
  const text = (input ?? '').trim();
  if (!text) return null;
  if (text.toLowerCase() === TEST_PAGE_URL) return TEST_PAGE_URL;
  if (PASSTHROUGH.test(text)) return text;
  if (!/\s/.test(text)) {
    const m = HOST_LIKE.exec(text);
    if (m) {
      const host = m[1];
      const hasPort = m[3] !== undefined;
      const port = hasPort ? Number(m[3]) : 0;
      const portOk = !hasPort || (port > 0 && port <= 65535);
      const lower = host.toLowerCase();
      const isKnownHost =
        lower === 'localhost' ||
        IPV4.test(lower) ||
        (host.startsWith('[') && host.includes(':')) ||
        DOMAIN.test(host) ||
        (LOCAL_SUFFIX.test(lower) && !lower.startsWith('.')) ||
        // single-label intranet host with explicit port, e.g. "nas:5000"
        (hasPort && /^[a-z0-9-]+$/i.test(host));
      if (isKnownHost && portOk) {
        const scheme = isLocalHost(lower) || (hasPort && !lower.includes('.')) ? 'http://' : 'https://';
        return scheme + text;
      }
    }
  }
  return searchUrl(text, engine);
}

/** Host of a URL ('www.' kept), or null for invalid/internal URLs. */
export function hostOf(url: string): string | null {
  if (!url || url === TEST_PAGE_URL) return null;
  const m = /^https?:\/\/(?:[^@/?#]*@)?(\[[^\]/]+\]|[^:/?#]+)/i.exec(url.trim());
  if (!m || !m[1]) return null;
  return m[1].toLowerCase();
}

/** Short display form for the address bar when not editing, e.g. 'example.com'. */
export function displayUrl(url: string): string {
  if (!url) return '';
  if (url === TEST_PAGE_URL) return 'Testseite';
  if (!/^https?:\/\//i.test(url)) return url;
  let s = url.replace(/^https?:\/\//i, '');
  s = s.replace(/^www\./i, '');
  if (s.endsWith('/')) s = s.slice(0, -1);
  return s;
}
