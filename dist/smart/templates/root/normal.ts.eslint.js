/*
* @eslint https://eslint.org/docs/user-guide/getting-started
* */
module.exports = {
  root: true,
  parser: 'typescript-eslint/parser',
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
