
  import prettier from 'eslint-plugin-prettier';
  import typescriptEslint from '@typescript-eslint/eslint-plugin';
  import globals from 'globals';
  import tsParser from '@typescript-eslint/parser';
  import path from 'node:path';
  import { fileURLToPath } from 'node:url';
  import js from '@eslint/js';
  import { FlatCompat } from '@eslint/eslintrc';
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
  });

  export default [
    ...compat.extends(
      'eslint:recommended',
      'prettier',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended'
    ),
    {
      plugins: {
        prettier,
        '@typescript-eslint': typescriptEslint,
      },

      languageOptions: {
        globals: {
          ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: 'module',

        parserOptions: {
          project: './tsconfig.json',
        },
      },

      rules: {
        'prettier/prettier': 2,

        'no-use-before-define': [
          'error',
          {
            functions: true,
            classes: true,
          },
        ],

        'no-var': 'error',
        'prefer-const': 'error',
      },
    },
  ];
  