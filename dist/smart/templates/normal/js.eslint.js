module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
    es2021: true,
    node: true,
    commonjs: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/errors',
    'plugin:import/warnings'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    include: [
      'src/*'
    ],
    // use Built-in in smart
    // project: './babel.config.js'
  },
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],

    'import/no-unresolved': 'off',
  },
  globals: {
    SMART_ENV: 'readonly'
  }
}
