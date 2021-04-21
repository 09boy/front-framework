module.exports = {
    presets: [
        ['@babel/preset-env', {targets: {node: 'current'}, modules: 'commonjs'}],
        '@babel/preset-typescript'
    ],
    parserOpts: {
        strictMode: true,
    },
    ignore: ['./bin/smart/templates'],
    plugins: [
        [
            'module-resolver',
            {
                'root': ['./bin'],
                extensions: ['.js', '.ts', '.mjs', '.json']
            }
        ],
        'add-module-exports',
        'const-enum',
        '@babel/plugin-transform-typescript'
    ],
};
