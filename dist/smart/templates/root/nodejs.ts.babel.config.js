module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}, modules: 'commonjs'}],
    '@babel/preset-typescript'
  ],
  parserOpts: {
    strictMode: true,
  },
  ignore: [],
  plugins: [
    [
      'module-resolver',
      {
        'root': ['./src'],
        extensions: ['.js', '.ts', '.json']
      }
    ],
    'add-module-exports',
    'const-enum',
    '@babel/plugin-transform-typescript'
  ],
};