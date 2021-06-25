module.exports = {
    presets: ['@babel/preset-react'],
    env: {
        development: {
            presets: [['@babel/preset-react', { development: true }]],
            plugins: [
                ['<smart_path>/node_modules/@babel/plugin-proposal-decorators', { legacy: true }],
                ['<smart_path>/node_modules/@babel/plugin-proposal-class-properties', {loose: true}],
            ],
        },
    },
    parserOpts: {
        strictMode: true
    },
    plugins: [
        [
            'module-resolver',
            {
                root: ['<rootPath>'],
                extensions: ['.js', '.jsx', '.mjs', '.json'],
                alias: {
                    'react-dom': '@hot-loader/react-dom',
                },
            }
        ],
        'add-module-exports',
    ]
};
