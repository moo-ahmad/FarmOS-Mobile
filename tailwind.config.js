/**
 * Tailwind / NativeWind theme — the Modernist design system (design_handoff).
 * Flat, architectural, near-monochrome: ink on a light ground with a single red
 * accent, zero corner radius, structure carried by ink rules. This file is the
 * styling source of truth; src/theme/tokens.ts mirrors the values needed in JS.
 *
 * @type {import('tailwindcss').Config}
 */

// Red accent ramp (--color-accent).
const accent = {
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
};

// Secondary accent ramp (--color-accent-2), used rarely.
const accent2 = {
  DEFAULT: '#e15b47',
  100: '#fff2ef',
  200: '#ffe0da',
  300: '#ffc4b9',
  400: '#ff9784',
  500: '#ef6853',
  600: '#c94b39',
  700: '#9e3526',
  800: '#71261b',
  900: '#471d16',
};

// Warm neutral ramp (--color-neutral-*). 0 is pure white for scroll bodies.
const neutral = {
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
};

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    // Zero corner radius anywhere — a hard rule of the Modernist system.
    borderRadius: {
      none: '0px',
      sm: '0px',
      DEFAULT: '0px',
      md: '0px',
      lg: '0px',
      xl: '0px',
      '2xl': '0px',
      '3xl': '0px',
      full: '0px',
    },
    extend: {
      colors: {
        ink: '#201e1d', // --color-text
        paper: '#f3f2f2', // --color-bg (app chrome)
        surface: '#eae9e9', // --color-surface
        // --color-divider = color-mix(ink 40%). RN has no color-mix, so it is
        // resolved to an ink-tinted rgba here.
        divider: 'rgba(32,30,29,0.4)',
        accent,
        accent2,
        neutral,
        // Semantic alias: alerts/overdue/low all render in the red accent.
        danger: '#ec3013',
      },
      // Structural borders: 2.5px section rules, 1.5px field borders, 2px totals.
      borderWidth: {
        hairline: '1px',
        field: '1.5px',
        total: '2px',
        rule: '2.5px',
      },
      fontFamily: {
        // Weight is baked into the loaded font family on RN (separate files).
        archivo: ['Archivo_400Regular'],
        'archivo-medium': ['Archivo_600SemiBold'],
        'archivo-bold': ['Archivo_800ExtraBold'],
      },
      fontSize: {
        // [size, lineHeight]. Micro-labels/kickers are 10px uppercase; row
        // titles 14; body 11–13; hero figures 38–44.
        micro: ['10px', '14px'],
        kicker: ['10px', '14px'],
        caption: ['11px', '16px'],
        body: ['13px', '20px'],
        label: ['14px', '18px'],
        row: ['14px', '18px'],
        heading: ['20px', '24px'],
        title: ['26px', '30px'],
        hero: ['38px', '40px'],
        'hero-lg': ['44px', '46px'],
      },
      letterSpacing: {
        hero: '-0.02em',
        tight: '-0.015em',
        micro: '0.11em',
        kicker: '0.12em',
      },
      // ≥44px hit targets (design) — we keep the project's 48px minimum.
      minHeight: { tap: '48px' },
      minWidth: { tap: '48px' },
    },
  },
  plugins: [],
};
