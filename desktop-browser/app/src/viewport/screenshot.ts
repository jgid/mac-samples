// STUB – implemented by work package C.
import type { ScreenshotMeta } from '../types';

/** Opens the iOS share sheet for a captured screenshot (file URI). */
export async function shareScreenshot(uri: string, meta: ScreenshotMeta): Promise<void> {
  throw new Error('not implemented');
}

/** Plain text description, e.g. for the clipboard: URL, size, agent, time. */
export function describeScreenshot(meta: ScreenshotMeta): string {
  throw new Error('not implemented');
}
