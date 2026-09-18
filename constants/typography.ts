/**
 * HanGul Tracker — Typography Scale
 *
 * Defines font sizes, line heights, font weights, and letter spacing.
 * All values follow a consistent type scale.
 */

import { Platform } from 'react-native';

// ---------------------------------------------------------------------------
// Font families
// ---------------------------------------------------------------------------

/**
 * System font stacks. Swap these out once custom fonts are loaded via
 * expo-font (e.g. Inter or Noto Sans KR for Hangul characters).
 */
export const FontFamily = {
  /** Regular prose and UI labels */
  regular: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
  /** Medium weight — headings, active tab labels */
  medium: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
  /** Bold weight — display headings, emphasis */
  bold: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
  /** Monospace — romanisation / pronunciation guides */
  mono: Platform.select({ ios: 'Courier New', android: 'monospace', default: 'monospace' }),
} as const;

// ---------------------------------------------------------------------------
// Font sizes
// ---------------------------------------------------------------------------

export const FontSize = {
  /** 10px — legal text, badges */
  xxs: 10,
  /** 12px — captions, helper text */
  xs: 12,
  /** 14px — body small, input labels */
  sm: 14,
  /** 16px — default body text */
  md: 16,
  /** 18px — body large, card titles */
  lg: 18,
  /** 22px — section headings */
  xl: 22,
  /** 28px — screen titles */
  '2xl': 28,
  /** 36px — display / hero text */
  '3xl': 36,
  /** 48px — large Hangul character display */
  '4xl': 48,
  /** 64px — full-screen character showcase */
  '5xl': 64,
} as const;

// ---------------------------------------------------------------------------
// Line heights (paired with font sizes)
// ---------------------------------------------------------------------------

export const LineHeight = {
  xxs: 14,
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  '2xl': 38,
  '3xl': 46,
  '4xl': 60,
  '5xl': 78,
} as const;

// ---------------------------------------------------------------------------
// Font weights
// ---------------------------------------------------------------------------

export const FontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

// ---------------------------------------------------------------------------
// Letter spacing
// ---------------------------------------------------------------------------

export const LetterSpacing = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
  widest: 1.6,
} as const;

export type FontSizeKey = keyof typeof FontSize;
export type FontWeightKey = keyof typeof FontWeight;
