import * as Sharing from 'expo-sharing';
import { formatResolution } from '../core/resolution';
import type { ScreenshotMeta } from '../types';

const pad2 = (n: number): string => String(n).padStart(2, '0');

/** "29.09.2026 14:03" (de-DE, local time). Manual formatting avoids depending on Intl in Hermes. */
export function formatDateTime(date: Date): string {
  return (
    `${pad2(date.getDate())}.${pad2(date.getMonth() + 1)}.${date.getFullYear()} ` +
    `${pad2(date.getHours())}:${pad2(date.getMinutes())}`
  );
}

/** Opens the iOS share sheet for a captured screenshot (file URI). */
export async function shareScreenshot(uri: string, meta: ScreenshotMeta): Promise<void> {
  const fileUri = uri.startsWith('/') ? `file://${uri}` : uri;
  const title = meta.title.trim() || meta.url;
  await Sharing.shareAsync(fileUri, {
    mimeType: 'image/png',
    UTI: 'public.png',
    dialogTitle: `Screenshot: ${title} (${formatResolution(meta.resolution)})`,
  });
}

/** Plain text description, e.g. for the clipboard: URL, size, agent, time. */
export function describeScreenshot(meta: ScreenshotMeta): string {
  const lines = [
    `Titel: ${meta.title.trim() || '–'}`,
    `URL: ${meta.url}`,
    `Viewport: ${formatResolution(meta.resolution)} CSS-Pixel`,
    `Kennung: ${meta.agentLabel} (rendert mit WebKit)`,
    `Zeit: ${formatDateTime(meta.takenAt)}`,
  ];
  return lines.join('\n');
}
