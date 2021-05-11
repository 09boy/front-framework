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
  settings: {
    'import/resolver': {
      'babel-module': {
        allowExistingDirectories: true,
      },
    },
  },
};
