module.exports = {
  parser: '@babel/eslint-parser',
  plugins: [
    'import',
  ],
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  rules: {
    'import/no-unresolved': 'off',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',

    'array-bracket-spacing': [
      'error',
      'never'
    ],
    quotes: [
      'error',
      'single'
    ],
    semi: [
      'error',
      'always'
    ],
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          consistent: true
        },
        ObjectPattern: {
          consistent: true
        },
        ImportDeclaration: 'never',
        ExportDeclaration: 'never'
      }
    ],
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
    commonjs: true,
    jest: true,
    'shared-node-browser': true
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      node: {
        extensions: [
          '.js',
          '.vue',
        ]
      },
      'babel-module': {}
    }
  }
};
