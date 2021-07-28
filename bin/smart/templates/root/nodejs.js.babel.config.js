module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}, modules: 'commonjs'}],
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
        extensions: ['.js', '.json']
      }
    ],
    'add-module-exports',
    'const-enum',
  ],
};