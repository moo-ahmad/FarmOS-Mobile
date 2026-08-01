'use strict';

/**
 * Jest for pure logic (decimal, sync) — no React Native runtime. Tests run in
 * plain Node and transpile TypeScript with ts-jest to CommonJS. UI/component
 * tests (jest-expo) are configured separately when that phase lands.
 *
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // Per-file transpilation (no whole-program type-check — that is
        // `pnpm typecheck`'s job), which also avoids TS6's rootDir diagnostics.
        isolatedModules: true,
        // Force CommonJS output regardless of the app's bundler-oriented tsconfig.
        // rootDir is set explicitly because TS6 otherwise errors (TS5011) when a
        // single test file is the only input.
        tsconfig: {
          module: 'CommonJS',
          verbatimModuleSyntax: false,
          rootDir: '.',
        },
      },
    ],
  },
};
