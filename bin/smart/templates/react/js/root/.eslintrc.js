module.exports = {
    parser: '@babel/eslint-parser',
    plugins: [
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
    ],
    rules: {
        'import/no-unresolved': 'off',
        'import/named': 'error',
        'import/namespace': 'error',
        'import/default': 'error',
        'import/export': 'error',

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
                    '.jsx',
                    '.js'
                ]
            },
            'babel-module': {}
        }
    }
};
