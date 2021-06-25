module.exports = {
  parserOpts: {
    strictMode: true,
  },
  plugins: [
    [
      'module-resolver',
      {
        root: ['<rootPath>'],
        extensions: ['.js', '.ts', '.mjs', '.json']
      }
    ],
    'add-module-exports'
  ],
};
