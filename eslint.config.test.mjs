import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintReact from '@eslint-react/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: [
            'src/data.json',
            '*.svg',
            'package-lock.json',
            'node_modules/**',
            'build/**',
            'dist/**',
            'eslint.config.test.mjs',
        ],
    },
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        languageOptions: {
            parser: tseslint.parser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            ...eslintReact.configs.recommended.plugins,
            'react-hooks': reactHooks,
        },
        rules: {
            ...eslintReact.configs.recommended.rules,
            ...reactHooks.configs['recommended-latest'].rules,
            'indent': ['error', 4],
            'linebreak-style': ['error', 'unix'],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
        },
        settings: {
            ...eslintReact.configs.recommended.settings,
        },
    },
    {
        files: ['*.config.{js,mjs,cjs}'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
];
