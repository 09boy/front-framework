"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDevelopmentPlugins = getDevelopmentPlugins;

var _webpack = require("webpack");

var _eslintWebpackPlugin = _interopRequireDefault(require("eslint-webpack-plugin"));

var _tool = require("../../share/tool");

var _path = require("../../share/path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDevelopmentPlugins(devMode, projectType, projectLanguageType) {
  if (!devMode) {
    return [];
  }

  const isTs = projectLanguageType !== 'js';
  const options = {
    extensions: ['js', 'ts', 'jsx', 'tsx', 'json'],
    fix: true
  };

  if (projectType === 'react') {
    const presets = !isTs ? [[(0, _tool.getDynamicModule)('@babel/preset-react'), {
      development: true
    }], (0, _tool.getDynamicModule)('@babel/preset-flow')] : [[(0, _tool.getDynamicModule)('@babel/preset-react'), {
      development: true
    }], [(0, _tool.getDynamicModule)('@babel/preset-typescript'), {
      isTsx: true,
      allExtensions: true
    }], (0, _tool.getDynamicModule)('@babel/preset-flow')];
    options.baseConfig = {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        sourceType: 'module',
        ecmaVersion: 2020,
        project: _path.PROJECT_ROOT_PATH + '/tsconfig.json'
        /*babelOptions: {
          env: {
            development: {
              presets,
            }
          }
        },*/

      }
    };
  }

  return [new _webpack.HotModuleReplacementPlugin(), new _webpack.NoEmitOnErrorsPlugin(), new _eslintWebpackPlugin.default(options)];
}