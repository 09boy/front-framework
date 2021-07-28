module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    globalReturn: true,
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 12,
    createDefaultProgram: true,
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jest/recommended',
  ],
  rules: {
    // jest
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",

    //
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    '@typescript-eslint/no-misused-promises': [
      'off',
      {
        'checks': ['conditional', 'void-return']
      }
    ],

    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],

    'object-curly-newline': ['error', {
      'ObjectExpression': { consistent: true },
      'ObjectPattern': { consistent: true },
      'ImportDeclaration': 'never',
      'ExportDeclaration': 'never',
    }],
  },
  env: {
    node: true,
    es2020: true,
    commonjs: true,
    es6: true,
    'jest/globals': true,
  },
  settings: {
    jest: {
      version: 26
    },
    'import/resolver': {
      node: {
        extensions: [
          '.ts',
          '.js'
        ]
      }
    }
  }
};