module.exports = {
  parserOpts: {
    strictMode: true
  },
  plugins: [
    [
      'module-resolver',
      {
        root: ['<rootPath>'],
        extensions: ['.js', '.vue', '.mjs', '.json'],
      }
    ],
    'add-module-exports',
  ]
};
