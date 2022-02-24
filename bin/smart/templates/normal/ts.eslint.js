module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es2021: true,
    node: true,
    commonjs: true,
    jest: true,
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    include: [
      'src/*',
    ],
    // use Built-in in smart
    // project: './tsconfig.json'
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "@typescript-eslint/ban-ts-ignore": "off",
    'object-curly-spacing': [ 'error', 'always' ],
    'array-bracket-spacing': [ 'error', 'never' ],
    'object-curly-newline': [ 'error', {
      'ObjectExpression': { "consistent": true },
      'ObjectPattern': { "consistent": true },
      'ImportDeclaration': 'never',
      'ExportDeclaration': 'never',
    }],

    semi: ['error', 'always'],
    quotes: ['error', 'single'],

    'import/no-unresolved': 'off',
  },
  globals: {
    SMART_ENV: 'readonly'
  }
}