module.exports = {
  parserOpts: {
    strictMode: true
  },
  plugins: [
    [
      'module-resolver',
      {
        root: ['<rootPath>'],
        extensions: ['.ts', '.js', '.tsx', '.jsx', '.mjs', '.json'],
      }
    ],
    'add-module-exports',
  ]
};
