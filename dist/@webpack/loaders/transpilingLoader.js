"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTranspilingLoader = getTranspilingLoader;

var _env = require("../../share/env");

var _projectHelper = require("../../share/projectHelper");

function getTranspilingLoader({
  scriptType,
  projectType
}) {
  const devMode = (0, _env.isDevEnv)();
  const isTs = scriptType === 'ts';
  const isReact = projectType === 'react';
  let envOptions = {
    targets: 'defaults',
    loose: true,
    useBuiltIns: 'entry',
    corejs: {
      version: 3,
      proposals: true
    },
    bugfixes: devMode
  };
  const presets = [];
  const plugins = [(0, _projectHelper.getDynamicModule)('@babel/plugin-transform-runtime'), [(0, _projectHelper.getDynamicModule)('@babel/plugin-proposal-decorators'), {
    legacy: true
  }], [(0, _projectHelper.getDynamicModule)('@babel/plugin-proposal-class-properties'), {
    loose: true
  }], (0, _projectHelper.getDynamicModule)('@babel/plugin-syntax-dynamic-import'), (0, _projectHelper.getDynamicModule)('@babel/plugin-proposal-async-generator-functions')];

  if (isReact) {
    plugins.push((0, _projectHelper.getDynamicModule)('@babel/plugin-syntax-jsx'), (0, _projectHelper.getDynamicModule)('@babel/plugin-transform-react-jsx'), (0, _projectHelper.getDynamicModule)('@babel/plugin-transform-react-display-name'));

    if (devMode) {
      plugins.push((0, _projectHelper.getDynamicModule)('@babel/plugin-transform-react-jsx-self'), (0, _projectHelper.getDynamicModule)('@babel/plugin-transform-react-jsx-source'), (0, _projectHelper.getDynamicModule)('react-hot-loader/babel'));
    }

    presets.push([(0, _projectHelper.getDynamicModule)('@babel/preset-react'), {
      development: devMode
    }], (0, _projectHelper.getDynamicModule)('@babel/preset-flow'));
  }

  if (isTs) {
    presets.push([(0, _projectHelper.getDynamicModule)('@babel/preset-typescript'), {
      onlyRemoveTypeImports: true,
      allowDeclareFields: true
    }] //It includes   @babel/plugin-transform-typescript
    );
  }

  if (!devMode) {
    envOptions = { ...envOptions,
      debug: false,
      modules: false
    };
  }

  presets.unshift([// https://github.com/babel/babel/issues/10008
  // https://github.com/babel/babel/issues/9853
  (0, _projectHelper.getDynamicModule)('@babel/preset-env'), envOptions]);
  console.log(presets);
  return [{
    test: /\.(ts|js)x?$/,
    use: {
      loader: (0, _projectHelper.getDynamicModule)('babel-loader'),
      options: {
        babelrc: false,
        cacheDirectory: true,
        presets,
        plugins
      }
    }
  }];
}