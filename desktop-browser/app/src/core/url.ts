// STUB – implemented by work package A.
import type { SearchEngineId } from '../types';

/** Pseudo URL of the built-in viewport test page. */
export const TEST_PAGE_URL = 'deskview://test';

export const SEARCH_ENGINES: { id: SearchEngineId; label: string }[] = [];

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
  throw new Error('not implemented');
}

/** Host of a URL ('www.' kept), or null for invalid/internal URLs. */
export function hostOf(url: string): string | null {
  throw new Error('not implemented');
}

/** Short display form for the address bar when not editing, e.g. 'example.com'. */
export function displayUrl(url: string): string {
  throw new Error('not implemented');
}
