"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBabelResolveConfigData = getBabelResolveConfigData;
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

function getBabelResolveConfigData(projectType, scriptType, srcPath) {
  const isTs = scriptType === 'ts';
  const compilerOptions = { ...data.compilerOptions
  };
  compilerOptions.paths = {
    '*': [`${srcPath}/*`]
  };

  if (isTs) {
    compilerOptions.allowJs = true;
    compilerOptions.lib = ['es2020', 'dom'];
  }

  if (projectType === 'react') {
    compilerOptions.paths['react-dom'] = ['node_modules/@hot-loader/react-dom'];
    compilerOptions.jsx = 'react';
  }

  return { ...data,
    compilerOptions
  };
}