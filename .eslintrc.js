'use strict'

module.exports = {
  root: true,
  globals: {
    __DEV__: true
  },
  env: {
    node: true,
    jest: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:vue-libs/recommended',
    'plugin:vue/vue3-recommended'
  ],
  plugins: [
    '@typescript-eslint'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  rules: {
    'object-curly-spacing': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/no-use-before-define': 'off'
  }
}
