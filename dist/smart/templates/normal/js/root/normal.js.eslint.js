/*
* @eslint https://eslint.org/docs/user-guide/getting-started
* */
module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  extends: [
    'eslint:recommended',
    'prettier',
  ],
  env: {
    browser: true,
    node: true,
    es2021: true,
    commonjs: true,
    jest: true,
    'shared-node-browser': true
  },
  settings: {
    'import/resolver': {
      'babel-module': {
        allowExistingDirectories: true,
      },
    },
  },
};
