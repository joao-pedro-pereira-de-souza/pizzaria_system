import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylisticJs from '@stylistic/eslint-plugin-js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      indent: ['error', 2],
      '@stylistic/js/indent': ['error', 2],
      quotes: ['error', 'single'],
      'linebreak-style': ['error', 'unix'],
      '@typescript-eslint/no-explicit-any': 'off',
      semi: ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
    },
  },
  {
    languageOptions: { globals: globals.node },
  },
];
