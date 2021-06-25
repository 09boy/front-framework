module.exports = {
  parserOpts: {
    strictMode: true
  },
  plugins: [
    [
      'module-resolver',
      {
        root: ['<rootPath>'],
        extensions: ['.js', '.mjs', '.json'],
      }
    ],
    'add-module-exports',
  ]
};
