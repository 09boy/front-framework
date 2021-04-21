"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBabelResolveConfigData = getBabelResolveConfigData;

var _ProjectType = require("../../../types/ProjectType");

const data = {
  compilerOptions: {
    noImplicitAny: true,
    moduleResolution: 'node',
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    isolatedModules: false,
    module: 'esnext',
    target: 'esnext',
    skipLibCheck: true,
    sourceMap: true,
    noEmit: true,
    strict: true,
    lib: ['es2018'],
    baseUrl: '.',
    paths: {
      '*': ['<srcPath>']
    }
  },
  exclude: ['__tests__', 'node_modules', 'babel.config.js', 'jest.config.js']
};

function getBabelResolveConfigData(projectType, projectLanguageType = _ProjectType.ProjectLanguageType.Javascript, srcPath) {
  const isTs = projectLanguageType === _ProjectType.ProjectLanguageType.Typescript;
  data.compilerOptions.paths = {
    '*': [`${srcPath}/*`]
  };

  if (isTs) {
    data.compilerOptions.allowJs = true;
    data.compilerOptions.lib = ['es2020', 'dom'];
  }

  if (projectType === 'react') {
    data.compilerOptions.paths['react-dom'] = ['node_modules/@hot-loader/react-dom'];
    data.compilerOptions.jsx = 'react';
  }

  return data;
}