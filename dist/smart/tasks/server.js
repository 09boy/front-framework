"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startDevServe = startDevServe;
exports.startServer = startServer;

var _express = _interopRequireDefault(require("express"));

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackDevMiddleware = _interopRequireDefault(require("webpack-dev-middleware"));

var _webpackHotMiddleware = _interopRequireDefault(require("webpack-hot-middleware"));

var _webpack2 = _interopRequireDefault(require("../../@webpack"));

var _smartHelper = require("../../share/smartHelper");

var _path = require("../../share/path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();

async function startDevServe(option) {
  const configData = await (0, _smartHelper.getConfigData)(option);
  const config = (0, _webpack2.default)(configData);
  const compiler = (0, _webpack.default)(config);
  const {
    port,
    host
  } = configData;
  app.use(_express.default.static(`${_path.PROJECT_ROOT_PATH}${configData.buildDir}`));
  app.use((0, _webpackDevMiddleware.default)(compiler, {
    publicPath: config.output?.publicPath || '/'
  }));
  app.use((0, _webpackHotMiddleware.default)(compiler));
  app.get('*', function (req, res) {
    // res.sendFile( PROJECT_ROOT_PATH + configData.buildDir + '/index.html');
    compiler.outputFileSystem.readFile(_path.PROJECT_ROOT_PATH + configData.buildDir + '/index.html', (err, data) => {
      res.set('content-type', 'text/html');
      res.send(data);
      res.end();
    });
  });
  app.listen(port, function () {
    console.log(`Current app listening on http://${host}:${port}!\n`);
  });
}

function startServer(port, path) {
  app.use(_express.default.static(path));
  app.get('*', function (req, res) {
    res.sendFile(path + '/index.html');
  });
  app.listen(port, function () {
    console.log(`Current app listening on http://127.0.0.1:${port}!\n`);
  });
}