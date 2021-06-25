module.exports = {
    parserOpts: {
        strictMode: true,
    },
    plugins: [
        [
            'module-resolver',
            {
                root: ['<rootPath>'],
                alias: {
                    'react-dom': '@hot-loader/react-dom',
                },
                extensions: ['.js', '.ts', '.tsx', '.mjs', '.json']
            }
        ],
        'add-module-exports'
    ],
};
