/**
 * Tailwind / NativeWind theme — the styling source of truth for `className`.
 * Deliberately constrained: a single brand ramp, one neutral ramp, and a few
 * semantic colors. Raw values are mirrored in src/theme/tokens.ts for the places
 * that need them in JS (navigation theme, icon colors); keep the two in sync.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand: field green.
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        neutral: {
          0: '#ffffff',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        success: '#16a34a',
        warning: '#d97706',
        danger: '#dc2626',
        info: '#2563eb',
      },
      // 48px minimum tap target — a hard project requirement for outdoor,
      // one-handed use. Components default their hit area to this.
      minHeight: { tap: '48px' },
      minWidth: { tap: '48px' },
      fontSize: {
        // Constrained type scale [size, lineHeight].
        caption: ['12px', '16px'],
        label: ['14px', '20px'],
        body: ['16px', '24px'],
        heading: ['20px', '28px'],
        title: ['28px', '34px'],
      },
    },
  },
  plugins: [],
};
