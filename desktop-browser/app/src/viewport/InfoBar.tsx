import { Platform, StyleSheet, Text, View } from 'react-native';
import { formatResolution } from '../core/resolution';
import { TEST_PAGE_URL } from '../core/url';
import type { ScreenshotMeta } from '../types';
import { formatDateTime } from './screenshot';

/** Height of the screenshot info bar in CSS px (unscaled). */
export const INFO_BAR_HEIGHT = 44;

const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });

export function InfoBar({ meta, width }: { meta: ScreenshotMeta; width: number }) {
  const url = meta.url === TEST_PAGE_URL ? 'Deskview-Testseite' : meta.url;
  const text = [url, formatResolution(meta.resolution), meta.agentLabel, formatDateTime(meta.takenAt)].join(' · ');
  return (
    <View style={[styles.bar, { width }]}>
      <Text style={styles.text} numberOfLines={1} ellipsizeMode="middle">
        {text}
      </Text>
      <Text style={styles.brand}>Deskview</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: INFO_BAR_HEIGHT,
    backgroundColor: '#1c1c1e',
    borderTopWidth: 1,
    borderTopColor: '#3a3a3c',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  text: {
    flex: 1,
    color: '#e5e5ea',
    fontFamily: MONO,
    fontSize: 14,
  },
  brand: {
    marginLeft: 16,
    color: '#8e8e93',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
