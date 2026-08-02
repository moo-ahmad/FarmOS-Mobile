'use strict';

/**
 * Two Jest projects:
 *  - `node`   — pure logic (decimal, sync, i18n, schemas) in plain Node via
 *               ts-jest. Fast, no React Native runtime; where the real bugs live.
 *  - `components` — React Native component tests via jest-expo + React Native
 *               Testing Library.
 *
 * @type {import('jest').Config}
 */
module.exports = {
  projects: [
    {
      displayName: 'node',
      testEnvironment: 'node',
      roots: ['<rootDir>/src'],
      testMatch: ['**/*.test.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            isolatedModules: true,
            tsconfig: {
              module: 'CommonJS',
              verbatimModuleSyntax: false,
              rootDir: '.',
            },
          },
        ],
      },
    },
    {
      displayName: 'components',
      preset: 'jest-expo',
      testMatch: ['<rootDir>/src/**/*.test.tsx'],
      // Under pnpm, packages live at node_modules/.pnpm/<name>@<ver>/..., so the
      // usual flat-layout allow-list never matches. Match package names ANYWHERE
      // in the path (`.*`) instead, transforming the RN/Expo/NativeWind ESM that
      // ships untranspiled.
      transformIgnorePatterns: [
        'node_modules/(?!.*(react-native|@react-native|@react-navigation|expo|@expo|@shopify|@gorhom|nativewind|react-native-css-interop|react-native-svg|lucide-react-native|sentry-expo|@sentry))',
      ],
    },
  ],
};
