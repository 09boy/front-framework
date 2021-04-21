"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTranspilingLoader = getTranspilingLoader;

var _tool = require("../tool");

var _tool2 = require("../../share/tool");

var _ProjectType = require("../../types/ProjectType");

function getTranspilingLoader(env, projectType, projectLanguageType) {
  const devMode = (0, _tool.isDevEnv)(env);
  const isTs = projectLanguageType === _ProjectType.ProjectLanguageType.Typescript;
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
  const plugins = [(0, _tool2.getDynamicModule)('@babel/plugin-transform-runtime'), [(0, _tool2.getDynamicModule)('@babel/plugin-proposal-decorators'), {
    legacy: true
  }], [(0, _tool2.getDynamicModule)('@babel/plugin-proposal-class-properties'), {
    loose: true
  }], (0, _tool2.getDynamicModule)('@babel/plugin-syntax-dynamic-import'), (0, _tool2.getDynamicModule)('@babel/plugin-proposal-async-generator-functions')];

  if (isReact) {
    plugins.push((0, _tool2.getDynamicModule)('@babel/plugin-syntax-jsx'), (0, _tool2.getDynamicModule)('@babel/plugin-transform-react-jsx'), (0, _tool2.getDynamicModule)('@babel/plugin-transform-react-display-name'));

    if (devMode) {
      plugins.push((0, _tool2.getDynamicModule)('@babel/plugin-transform-react-jsx-self'), (0, _tool2.getDynamicModule)('@babel/plugin-transform-react-jsx-source'), (0, _tool2.getDynamicModule)('react-hot-loader/babel'));
    }

    presets.push([(0, _tool2.getDynamicModule)('@babel/preset-react'), {
      development: devMode
    }], (0, _tool2.getDynamicModule)('@babel/preset-flow'));
  }

  if (isTs) {
    presets.push([(0, _tool2.getDynamicModule)('@babel/preset-typescript'), {
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
  (0, _tool2.getDynamicModule)('@babel/preset-env'), envOptions]);
  return [{
    test: /\.(ts|js)x?$/,
    use: {
      loader: (0, _tool2.getDynamicModule)('babel-loader'),
      options: {
        // extends: PROJECT_ROOT_PATH + '/babel.config.js',
        cacheDirectory: true,
        presets,
        plugins
      }
    }
  }];
}