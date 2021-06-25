"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getPackageData;

var _shelljs = require("shelljs");

const packageData = {
  name: 'smart-sample-project',
  version: '1.0.0',
  scripts: {
    start: 'smart start',
    build: 'smart build -release',
    test: 'jest --forceExit --detectOpenHandles',
    lint: 'tsc --noEmit && eslint --ext .js,.jsx,.ts,.tsx ./',
    'prettier:write': 'npx prettier --write **/*.{js,jsx,ts,tsx,json} && npx prettier --write *.{js,jsx,ts,tsx,json}'
  },
  precommit: [],
  description: 'smart framework',
  keywords: [],
  dependencies: {},
  devDependencies: {},
  author: '09boy',
  license: 'ISC',
  homepage: 'https://09boy.net',
  repository: {
    type: 'git',
    url: 'https://github.com/09boy/front-framework.git'
  },
  smart: {}
};
const commondev = ['moment', 'axios'];
const commonsDev = ['@babel/core', '@babel/runtime', 'eslint', 'eslint-config-prettier', 'eslint-plugin-import', 'eslint-import-resolver-babel-module', 'eslint', 'babel-plugin-module-resolver', 'babel-plugin-add-module-exports', 'prettier', 'pretty-quick'];
const commonTsDev = ['@types/jest', '@typescript-eslint/eslint-plugin', 'eslint-config-airbnb-typescript', '@typescript-eslint/parser', 'typescript'];
const commonReact = ['react', 'react-dom', 'redux', 'react-redux', 'redux-saga', 'react-router-dom', 'redux-logger'];
const commonReactDev = ['eslint-plugin-react', 'react-test-renderer', 'prop-types'];
const commonReactTsDev = ['@types/react', '@types/react-redux', '@types/react-router-dom', '@types/redux-logger', '@react-native-community/eslint-config', '@types/react-test-renderer'];
const commonNode = ['bcrypt', 'connect-mongo', 'body-parser', 'express', 'cookie-parser', 'cors', 'cos-nodejs-sdk-v5', 'express', 'express-fileupload', 'express-session', 'mongoose', 'mongoose-paginate-v2', 'node-fetch', 'jsonwebtoken'];
const commonNodeDev = ['@babel/node', 'mongodb-memory-server', 'nodemon', 'ts-node'];
const commonNodeTsDev = ['@types/cookie-parser', '@types/express', '@types/express-fileupload', '@types/express-session', '@types/jsonwebtoken', '@types/mongoose-paginate-v2', '@types/node', '@types/node-fetch', '@typescript-eslint/eslint-plugin', '@typescript-eslint/parser'];
const commonVue = ['vue@3', 'vuex@4', 'vue-router@4'];

function getDependenciesName(projectType, isTs) {
  let dependencies = [...commondev];
  let devDependencies = [...commonsDev];

  if (isTs) {
    devDependencies = devDependencies.concat(commonTsDev);
  }

  switch (projectType) {
    case 'react':
      dependencies = dependencies.concat(commonReact);
      devDependencies = devDependencies.concat(isTs ? [...commonReactDev, ...commonReactTsDev] : commonReactDev);
      break;

    case 'vue':
      dependencies = dependencies.concat(commonVue);
      devDependencies.push(isTs ? '@typescript-eslint/parser' : '@babel/eslint-parser');
      break;

    case 'nodejs':
      dependencies = dependencies.concat(commonNode);
      devDependencies = devDependencies.concat(isTs ? [...commonNodeDev, ...commonNodeTsDev] : commonNodeDev);
      break;

    case 'miniProgram':
      break;

    default:
      // normal
      devDependencies.push(isTs ? '@typescript-eslint/parser' : '@babel/eslint-parser');
      break;
  }

  return {
    dependencies: [...new Set(dependencies)],
    devDependencies: [...new Set(devDependencies)]
  };
}

function getDependenciesVersion({
  dependencies,
  devDependencies
}) {
  const ds = {};
  const devS = {};
  [...dependencies].sort((a, b) => (a + '').localeCompare(b + '')).map(p => {
    const versions = (0, _shelljs.exec)(`npm view ${p.trim()} version`, {
      silent: true
    }).stdout.split('\n').filter(s => !!s);
    const version = versions.pop().split(' ').pop();

    if (p.includes('vue') && p.includes('@')) {
      p = p.split('@')[0];
    }

    ds[p.trim()] = `^${version.replace(/'/g, '')}`;
  });
  [...devDependencies].sort((a, b) => (a + '').localeCompare(b + '')).map(p => {
    const version = (0, _shelljs.exec)(`npm view ${p.trim()} version`, {
      silent: true
    }).stdout;
    devS[p.trim()] = `^${version.replace('\n', '')}`;
  });
  return {
    'dependencies': ds,
    'devDependencies': devS
  };
}

function getPackageData({
  projectType,
  scriptType,
  dirName
}, src) {
  const isTs = scriptType === 'ts';
  const dependenciesData = getDependenciesVersion(getDependenciesName(projectType, isTs));
  let lint = `tsc --noEmit && eslint --ext .js,.ts ./${src} --fix`; // normal and nodejs

  if (projectType === 'react') {
    lint = `tsc --noEmit && eslint --ext .js, .jsx, .ts, .tsx ./${src} --fix`;
  }

  return { ...packageData,
    name: `smart-${dirName}-project`,
    scripts: { ...packageData.scripts,
      lint
    },
    ...dependenciesData,
    smart: {
      projectType,
      scriptType
    }
  };
}

module.exports = exports.default;