/**
 * HanGul Tracker — Spacing & Border Radius Scale
 *
 * Base unit is 4px. All spacing tokens are multiples of the base.
 * Use these consistently instead of hard-coding numeric values in components.
 */

// ---------------------------------------------------------------------------
// Spacing
// ---------------------------------------------------------------------------

export const Spacing = {
  /** 0px */
  none: 0,
  /** 2px */
  xxs: 2,
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px */
  lg: 16,
  /** 20px */
  xl: 20,
  /** 24px */
  '2xl': 24,
  /** 32px */
  '3xl': 32,
  /** 40px */
  '4xl': 40,
  /** 48px */
  '5xl': 48,
  /** 64px */
  '6xl': 64,
} as const;

// ---------------------------------------------------------------------------
// Border radius
// ---------------------------------------------------------------------------

export const BorderRadius = {
  /** 0px — square corners */
  none: 0,
  /** 4px — subtle rounding (inputs, tags) */
  xs: 4,
  /** 8px — standard cards and buttons */
  sm: 8,
  /** 12px — large cards */
  md: 12,
  /** 16px — modal sheets, hero cards */
  lg: 16,
  /** 24px — pill-shaped elements */
  xl: 24,
  /** 32px — extra large pills */
  '2xl': 32,
  /** 9999px — fully circular (avatars, icon buttons) */
  full: 9999,
} as const;

// ---------------------------------------------------------------------------
// Shadows (iOS + Android compatible)
// ---------------------------------------------------------------------------

export const Shadow = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 6,
  },
  xl: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
  },
} as const;

export type SpacingKey = keyof typeof Spacing;
export type BorderRadiusKey = keyof typeof BorderRadius;
export type ShadowKey = keyof typeof Shadow;
