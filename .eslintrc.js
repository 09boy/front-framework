module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        globalReturn: true,
        include: [
            'bin/**/*.ts',
            'bin/**/*.js',
        ],
        exclude: [
            'bin/smart/templates/'
        ],
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 12,
    },
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
        // 'prettier/@typescript-eslint',
    ],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-explicit-any': 'off', // TODO: fix all explicit any before set it to error.
        "@typescript-eslint/ban-ts-ignore": "off",
        'object-curly-spacing': [ 'error', 'always' ],
        'array-bracket-spacing': [ 'error', 'never' ],
        'quotes': [ 'error', 'single' ],
        'semi': [ 'error', 'always' ],
        'object-curly-newline': [ 'error', {
            'ObjectExpression': { "consistent": true },
            'ObjectPattern': { "consistent": true },
            'ImportDeclaration': 'never',
            'ExportDeclaration': 'never',
        }],
    },
    env: {
        node: true,
        es2020: true,
        commonjs: true,
        es6: true,
        jest: true,
    },
    settings: {
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
