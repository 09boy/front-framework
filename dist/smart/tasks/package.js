"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPackageData = getPackageData;
const packageData = {
  name: '',
  version: '1.0.0',
  scripts: {
    start: 'smart start',
    buildTest: 'smart build dev',
    buildProd: 'smart build prod',
    test: 'jest --version'
  },
  browserslist: ['defaults', 'not IE 11', 'maintained node versions'],
  license: 'ISC',
  repository: {
    type: 'git',
    url: 'https://github.com/09boy/front-framework.git'
  },
  homepage: 'https://github.com/09boy/front-framework.git',
  author: '09boy'
};

function getDependencies(type, sType) {
  const names = ['@babel/runtime' // use babel-transform-runtime
  ];
  const devNames = ['eslint', 'eslint-plugin-import'];
  const isTs = sType === 'ts';

  if (isTs) {
    devNames.push('typescript', '@types/node', '@types/webpack-env', '@typescript-eslint/parser', '@typescript-eslint/eslint-plugin', '@babel/preset-typescript');
  } else {
    devNames.push('@babel/eslint-parser');
  }

  switch (type) {
    case 'normal':
      break;

    case 'react':
      devNames.push('eslint-plugin-react', 'eslint-plugin-react-hooks', 'eslint-plugin-jsx-a11y', '@babel/preset-react', '@types/react', '@types/react-dom');
      names.push('react', 'react-dom', 'react-router-dom');
      break;

    case 'vue':
      break;

    case 'nodejs':
      names.push('express');
      break;

    case 'miniProgram':
      break;
  }

  return {
    dependencies: names,
    devDependencies: devNames
  };
}

function getPackageData(type, sType) {
  return {
    packageData,
    ...getDependencies(type, sType)
  };
}