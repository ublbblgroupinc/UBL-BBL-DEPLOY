import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJest from 'eslint-plugin-jest';
import stylisticJs from '@stylistic/eslint-plugin-js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['src/**/*.{ts,js}'],
    plugins: { '@stylistic/js' : stylisticJs },
    languageOptions: { globals: globals.browser },
    rules: { 
      '@stylistic/js/indent': ['error', 2],
      ...stylisticJs.rules.schema,
      ...pluginJs.configs.recommended.rules
    }
  },
  {
    files: ['test/**/*.{ts,js}'],
    plugins: {jest: pluginJest, '@stylistic/js' : stylisticJs },
    languageOptions: { globals: pluginJest.environments.globals.globals },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      ...pluginJest.configs.recommended.rules,
      ...stylisticJs.rules.schema,
    },
  },
];