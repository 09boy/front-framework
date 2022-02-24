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
    'plugin:import/warnings',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  plugins: [
    'react',
    'jsx-a11y',
    'react-hooks'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    include: [
      'src/*'
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
    semi: ['error', 'always'],
    quotes: ['error', 'single'],

    'import/no-unresolved': 'off',

    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  },
  react: {
    createClass: 'createReactClass',
    pragma: 'react',
    fragment: 'Fragment',
    version: 'detect',
  },
  globals: {
    SMART_ENV: 'readonly'
  }
}