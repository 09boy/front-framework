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
    'react',
    'react-hooks',
    'jsx-a11y'
  ],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    include: [
      'src/*',
    ],
    ecmaFeatures: {
      jsx: true,
      legacyDecorators: true,
      experimentalDecorators: true
    },
    // only for development
    project: './babelConfig.json'
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    'object-curly-spacing': [ 'error', 'always' ],
    'array-bracket-spacing': [ 'error', 'never' ],
    'object-curly-newline': [ 'error', {
      'ObjectExpression': { consistent: true },
      'ObjectPattern': { consistent: true },
      'ImportDeclaration': 'never',
      'ExportDeclaration': 'never',
    }],

    semi: ['error', 'always'],
    quotes: ['error', 'single'],

    'import/no-unresolved': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',

    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  },
  settings: {
    react: {
      createClass: 'createReactClass',
      pragma: 'react',
      fragment: 'Fragment',
      version: 'detect',
    }
  },
  globals: {
    SMART_ENV: 'readonly'
  }
}