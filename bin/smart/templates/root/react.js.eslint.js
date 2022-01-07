module.exports = {
  parser: '@typescript-eslint/parser',
  ignorePatterns: [],
  plugins: [
    '@typescript-eslint',
    'react',
    'jsx-a11y',
    'react-hooks',
    'import',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'import/no-unresolved': 'off',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',

    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    // "@typescript-eslint/ban-ts-ignore": "off",
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
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
          '.jsx'
        ]
      },
      'babel-module': {}
    }
  }
};
