/**
 * Runtime-accessible design tokens. These mirror the values in
 * `tailwind.config.js` for the places that can't use `className` — React
 * Navigation themes, icon colors, hit slops. Keep the two in sync; Tailwind is
 * the source of truth for styling, this is the JS escape hatch.
 */

export const palette = {
  primary: {
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  neutral: {
    0: '#ffffff',
    100: '#f1f5f9',
    500: '#64748b',
    900: '#0f172a',
    950: '#020617',
  },
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
  info: '#2563eb',
} as const;

/** Minimum tap target (px). A hard requirement for outdoor, one-handed use. */
export const MIN_TAP_TARGET = 48;

export const lightTheme = {
  text: palette.neutral[900],
  background: palette.neutral[0],
  surface: palette.neutral[100],
  primary: palette.primary[600],
  border: '#e2e8f0',
} as const;

export const darkTheme = {
  text: palette.neutral[0],
  background: palette.neutral[950],
  surface: palette.neutral[900],
  primary: palette.primary[500],
  border: '#1e293b',
} as const;

export type ThemeColors = typeof lightTheme;
