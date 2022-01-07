module.exports = {
  parserOpts: {
    strictMode: true
  },
  plugins: [
    [
      'module-resolver',
      {
        root: ['<rootPath>'],
        extensions: ['.js', '.jsx', '.mjs', '.json'],
      }
    ],
    'add-module-exports',
  ]
};
