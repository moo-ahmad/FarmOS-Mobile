'use strict';

const expoFlatConfig = require('eslint-config-expo/flat');
const eslintConfigPrettier = require('eslint-config-prettier');
const tseslint = require('typescript-eslint');
const globals = require('globals');
const localRules = require('./eslint-local-rules');

/**
 * Flat ESLint config.
 *
 * Layers, in order:
 *  1. eslint-config-expo (core, typescript-eslint, react, react-hooks, import,
 *     expo) — the React Native / Expo baseline.
 *  2. A type-aware block that turns on the TypeScript project service and wires
 *     in our local rules (notably `local/no-money-arithmetic`, the decimal
 *     precision guard). Type-aware linting is required for that rule to see
 *     the `Money` / `Quantity` brands.
 *  3. eslint-config-prettier last, to switch off any stylistic rules that would
 *     fight Prettier.
 */
module.exports = [
  {
    ignores: [
      'dist/**',
      '.expo/**',
      'node_modules/**',
      'android/**',
      'ios/**',
      'expo-env.d.ts',
      'scripts/**',
      'src/db/migrations/**',
    ],
  },
  ...expoFlatConfig,
  {
    // CommonJS tooling files (this config, the local rules, metro/babel config)
    // run in Node, not the RN/browser runtime.
    files: ['**/*.{js,cjs}', 'eslint-local-rules/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      local: localRules,
    },
    rules: {
      'local/no-money-arithmetic': 'error',
    },
  },
  {
    // Jest test files run in Node with Jest globals.
    files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.jest, ...globals.node },
    },
  },
  eslintConfigPrettier,
];
