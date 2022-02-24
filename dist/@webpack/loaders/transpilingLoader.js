"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTranspilingLoader = getTranspilingLoader;

var _smartHelper = require("../../share/smartHelper");

var _webpackHelper = require("../../share/webpackHelper");

function getTranspilingLoader(devMode, projectType, scriptType) {
  const hasCustomBabelConfig = (0, _webpackHelper.hasBabelConfigFile)();
  const loaderOption = {};

  if (!hasCustomBabelConfig) {
    const isTs = scriptType === 'ts';
    const isReact = projectType === 'react';
    const envOptions = {
      // targets: 'defaults', config in package.json
      loose: true,
      useBuiltIns: 'entry',
      corejs: {
        version: 3,
        proposals: true
      },
      bugfixes: devMode // debug: devMode,

    };
    const presets = [[(0, _smartHelper.getDynamicModule)('@babel/preset-env'), envOptions]];
    const plugins = [[(0, _smartHelper.getDynamicModule)('@babel/plugin-transform-runtime'), {
      regenerator: false
    }], //
    [(0, _smartHelper.getDynamicModule)('@babel/plugin-proposal-decorators'), {
      legacy: true
    }], [(0, _smartHelper.getDynamicModule)('@babel/plugin-proposal-class-properties'), {
      loose: true
    }]];

    if (isReact) {
      presets.push([(0, _smartHelper.getDynamicModule)('@babel/preset-react'), {
        development: devMode
      }]);
    }

    if (devMode) {
      if (isReact) {
        presets.push((0, _smartHelper.getDynamicModule)('@babel/preset-flow'));
        plugins.push((0, _smartHelper.getDynamicModule)('@babel/plugin-transform-react-jsx-self'), (0, _smartHelper.getDynamicModule)('@babel/plugin-transform-react-jsx-source'), (0, _smartHelper.getDynamicModule)('react-hot-loader/babel'));
      }
    } else {//
    }

    if (isTs) {
      presets.push([(0, _smartHelper.getDynamicModule)('@babel/preset-typescript'), {
        onlyRemoveTypeImports: true,
        allowDeclareFields: true
      }] //It includes   @babel/plugin-transform-typescript
      );
    } // getDynamicModule('@babel/plugin-syntax-dynamic-import'),
    // getDynamicModule('@babel/plugin-proposal-async-generator-functions'),
    // https://blog.liuyunzhuge.com/2019/09/04/babel%E8%AF%A6%E8%A7%A3%EF%BC%88%E4%BA%94%EF%BC%89-polyfill%E5%92%8Cruntime/
    // https://github.com/babel/babel/issues/10008
    // https://github.com/babel/babel/issues/9853
    // https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md


    loaderOption.presets = presets;
    loaderOption.plugins = plugins;
  } // console.log(loaderOption);


  const loaders = [{
    test: /\.(ts|js)x?$/,
    use: {
      loader: (0, _smartHelper.getDynamicModule)('babel-loader'),
      options: loaderOption
    }
  }];

  if (projectType === 'vue') {
    loaders.push({
      test: /\.vue$/,
      loader: (0, _smartHelper.getDynamicModule)('vue-loader')
    });
    loaders.push({
      test: /\.pug$/,
      loader: (0, _smartHelper.getDynamicModule)('pug-plain-loader')
    });
  }

  return loaders;
}