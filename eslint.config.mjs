import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.js'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'commonjs',
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
  },
  {
    files: ['**/*.ts', '**/*.mts', '**/*.cts'],
    extends: tseslint.configs.recommended,
  },
]);
