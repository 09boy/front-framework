"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWebpackMiddleware = getWebpackMiddleware;

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackDevMiddleware = _interopRequireDefault(require("webpack-dev-middleware"));

var _connectHistoryApiFallback = _interopRequireDefault(require("connect-history-api-fallback"));

var _webpackHotMiddleware = _interopRequireDefault(require("webpack-hot-middleware"));

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getWebpackMiddleware(option) {
  var _webpackConfig$output;

  const webpackConfig = (0, _index.default)(option);
  const compiler = (0, _webpack.default)(webpackConfig);
  const publicPath = (_webpackConfig$output = webpackConfig.output) === null || _webpackConfig$output === void 0 ? void 0 : _webpackConfig$output.publicPath;

  if (typeof publicPath !== 'string') {
    return [];
  }

  const devOptions = {
    publicPath,
    mimeTypes: {
      phtml: 'text/html'
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'X-Requested-With',
      'X-Custom-Header': 'yes'
    },
    writeToDisk: filename => filename.includes('index.html')
  };
  const devCompiler = (0, _webpackDevMiddleware.default)(compiler, devOptions); // console.log(devCompiler);

  return [(0, _connectHistoryApiFallback.default)(), devCompiler, (0, _webpackHotMiddleware.default)(compiler, {
    path: '/__webpack_hmr'
  }), (0, _connectHistoryApiFallback.default)()];
}