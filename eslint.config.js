import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';
import * as firebaseRulesParser from './node_modules/@firebase/eslint-plugin-security-rules/dist/src/parser.js';

export default [
  {
    files: ['**/*.rules'],
    languageOptions: {
      parser: firebaseRulesParser,
    },
    plugins: {
      'firebase-rules': firebaseRulesPlugin,
    },
    rules: {
      ...firebaseRulesPlugin.configs['flat/recommended'].rules,
    },
  },
];
