import { useColorScheme } from 'react-native';
import type { ModalProps } from 'react-native';

export interface Colors {
  background: string;
  groupedBackground: string;
  surface: string;
  surfaceElevated: string;
  chrome: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  separator: string;
  tint: string;
  tintSoft: string;
  onTint: string;
  danger: string;
  success: string;
  warning: string;
  fieldBackground: string;
  overlay: string;
  chipBackground: string;
  chipText: string;
  viewportBackground: string;
}

const light: Colors = {
  background: '#FFFFFF',
  groupedBackground: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  chrome: '#F7F7F9',
  text: '#000000',
  textSecondary: '#6C6C70',
  textTertiary: '#AEAEB2',
  separator: '#D1D1D6',
  tint: '#007AFF',
  tintSoft: 'rgba(0,122,255,0.12)',
  onTint: '#FFFFFF',
  danger: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  fieldBackground: '#E9E9EE',
  overlay: 'rgba(0,0,0,0.35)',
  chipBackground: 'rgba(28,28,30,0.72)',
  chipText: '#FFFFFF',
  viewportBackground: '#1C1C1E',
};

const dark: Colors = {
  background: '#000000',
  groupedBackground: '#000000',
  surface: '#1C1C1E',
  surfaceElevated: '#2C2C2E',
  chrome: '#161618',
  text: '#FFFFFF',
  textSecondary: '#AEAEB2',
  textTertiary: '#636366',
  separator: '#38383A',
  tint: '#0A84FF',
  tintSoft: 'rgba(10,132,255,0.22)',
  onTint: '#FFFFFF',
  danger: '#FF453A',
  success: '#30D158',
  warning: '#FF9F0A',
  fieldBackground: '#2C2C2E',
  overlay: 'rgba(0,0,0,0.55)',
  chipBackground: 'rgba(44,44,46,0.8)',
  chipText: '#FFFFFF',
  viewportBackground: '#0B0B0C',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 6, md: 10, lg: 14, xl: 20, pill: 999 } as const;
export const fontSize = { caption: 12, footnote: 13, body: 17, subhead: 15, title: 20, largeTitle: 28 } as const;
/** Minimum tap target (Apple HIG). */
export const HIT = 44;

/** Keep sheets usable in landscape (RN defaults iOS modals to portrait only). */
export const SHEET_ORIENTATIONS: ModalProps['supportedOrientations'] = [
  'portrait',
  'portrait-upside-down',
  'landscape',
  'landscape-left',
  'landscape-right',
];

export interface Theme {
  dark: boolean;
  colors: Colors;
}

const LIGHT_THEME: Theme = { dark: false, colors: light };
const DARK_THEME: Theme = { dark: true, colors: dark };

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? DARK_THEME : LIGHT_THEME;
}
