module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    globalReturn: true,
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 12,
    createDefaultProgram: true,
  },
  plugins: [],
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
  ],
  rules: {
    // jest
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",

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
          '.js'
        ]
      }
    }
  }
};