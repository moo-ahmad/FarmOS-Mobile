/**
 * Runtime-accessible Modernist design tokens. These mirror tailwind.config.js
 * for the places that can't use `className` — SVG charts, Lucide icon colors,
 * the custom tab bar. Tailwind is the source of truth for styling; keep in sync.
 */

export const colors = {
  ink: '#201e1d',
  paper: '#f3f2f2',
  surface: '#eae9e9',
  white: '#ffffff',
  divider: 'rgba(32,30,29,0.4)',
  accent: {
    DEFAULT: '#ec3013',
    100: '#fff2ef',
    200: '#ffe0d9',
    300: '#ffc4b8',
    400: '#ff9783',
    500: '#ff563c',
    600: '#dd2b0f',
    700: '#ae1800',
    800: '#7c1405',
    900: '#4d170e',
  },
  neutral: {
    0: '#ffffff',
    100: '#f8f4f4',
    200: '#eae7e7',
    300: '#d7d3d3',
    400: '#bab6b6',
    500: '#9b9797',
    600: '#7d7979',
    700: '#605d5d',
    800: '#444141',
    900: '#2d2b2b',
  },
} as const;

/** Loaded Archivo family names (weight is baked into the family on RN). */
export const fonts = {
  regular: 'Archivo_400Regular',
  medium: 'Archivo_600SemiBold',
  bold: 'Archivo_800ExtraBold',
} as const;

/** Structural rule widths, in px. */
export const rules = {
  section: 2.5,
  total: 2,
  field: 1.5,
  divider: 1,
} as const;

/** Minimum tap target (px). Design requires ≥44; the project keeps 48. */
export const MIN_TAP_TARGET = 48;
