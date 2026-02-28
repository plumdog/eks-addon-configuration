import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
    // Base ESLint recommended rules
    js.configs.recommended,
    
    // TypeScript ESLint recommended rules
    ...tseslint.configs.recommended,
    
    // Global ignores (replaces .eslintignore)
    {
        ignores: [
            'src/data.json',
            '*.svg',
            'package-lock.json',
            'node_modules/**',
            'build/**',
            'dist/**',
        ],
    },
    
    // Main configuration for all source files
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
            react: reactPlugin,
            'react-hooks': reactHooks,
        },
        rules: {
            // React recommended rules
            ...reactPlugin.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            
            // Custom rules from original config
            'indent': ['error', 4],
            'linebreak-style': ['error', 'unix'],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            
            // React 17+ doesn't need React in scope
            'react/react-in-jsx-scope': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    
    // Configuration for config files (Node environment)
    {
        files: ['*.config.{js,mjs,cjs}'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
];
