"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDevelopmentPlugins = getDevelopmentPlugins;

var _webpack = require("webpack");

var _eslintWebpackPlugin = _interopRequireDefault(require("eslint-webpack-plugin"));

var _env = require("../../share/env");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*import { getDynamicModule } from 'share/projectHelper';
import { PROJECT_ROOT_PATH } from 'share/path';*/
function getDevelopmentPlugins({
  projectType
}) {
  const devMode = (0, _env.isDevEnv)();

  if (!devMode) {
    return [];
  } // const isTs = scriptType === 'ts';


  const options = {
    extensions: ['js', 'ts', 'jsx', 'tsx', 'json'],
    fix: true
  };

  if (projectType === 'react') {
    /*const presets = !isTs ? [[getDynamicModule('@babel/preset-react'), { development: true }], getDynamicModule('@babel/preset-flow')] :
      [
        [getDynamicModule('@babel/preset-react'), { development: true }],
        [getDynamicModule('@babel/preset-typescript'), { isTsx: true, allExtensions: true }],
        getDynamicModule('@babel/preset-flow')
      ];*/

    /*options.baseConfig = {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        sourceType: 'module',
        ecmaVersion: 2020,
        project: PROJECT_ROOT_PATH + '/tsconfig.json',
        /!*babelOptions: {
          env: {
            development: {
              presets,
            }
          }
        },*!/
      },
    };*/
  }

  return [new _webpack.HotModuleReplacementPlugin(), new _webpack.NoEmitOnErrorsPlugin(), new _eslintWebpackPlugin.default(options)];
}