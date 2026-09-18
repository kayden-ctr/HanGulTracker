/**
 * HanGul Tracker — Color Palette
 *
 * All raw color values live here. Consume these through the theme
 * (constants/theme.ts) rather than importing colors directly in components.
 */

export const Palette = {
  // Brand blues
  primary: '#099FFC',
  primaryDark: '#0484FC',
  secondary: '#2FADFC',
  accent: '#44B7FC',
  card: '#B4F2FC',
  surface: '#9FE9FC',
  lightSurface: '#90E3FC',
  muted: '#76D5FC',

  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',

  // Text
  text: '#0F172A',
  textSecondary: '#64748B',

  // Neutral scale (used for dark mode surfaces)
  white: '#FFFFFF',
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',
  black: '#000000',

  // Transparent
  transparent: 'transparent',
} as const;

export type PaletteKey = keyof typeof Palette;
