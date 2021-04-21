"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPackageData = getPackageData;

var _shelljs = require("shelljs");

var _ProjectType = require("../../../types/ProjectType");

const packageData = {
  name: 'smart-sample-project',
  version: '1.0.0',
  scripts: {
    start: 'smart start',
    build: 'smart build -release',
    test: 'smart test'
  },
  precommit: [],
  description: 'smart framework',
  keywords: [],
  dependencies: {},
  devDependencies: {},
  author: '09boy',
  license: 'ISC',
  homepage: '',
  repository: {
    type: 'git',
    url: ''
  }
};
const commonsDev = ['jest', 'babel-jest', 'pre-commit', 'eslint-plugin-import', 'eslint-import-resolver-babel-module', 'eslint', 'babel-plugin-module-resolver', 'babel-plugin-add-module-exports'];

function getDependenciesName(projectType, isTs) {
  let dependencies = [];
  let devDependencies = isTs ? ['typescript', '@typescript-eslint/parser', '@typescript-eslint/eslint-plugin', 'ts-jest', '@types/jest', ...commonsDev] : ['@babel/eslint-parser', ...commonsDev];

  switch (projectType) {
    case _ProjectType.ProjectType.Unknown:
    case _ProjectType.ProjectType.Normal:
      dependencies = ['moment'];
      break;

    case _ProjectType.ProjectType.React:
      dependencies = ['moment', 'react', '@hot-loader/react-dom', '@reduxjs/toolkit', 'redux-saga', 'reselect', 'redux-logger', 'react-redux', 'react-router-dom'];
      devDependencies = [...devDependencies, 'eslint-plugin-react', 'eslint-plugin-react-hooks', 'eslint-plugin-jsx-a11y', 'react-test-renderer', 'prop-types'];

      if (isTs) {
        devDependencies.push('@types/react', '@types/react-redux', '@types/redux-logger', '@types/react-router-dom');
      }

      break;

    case _ProjectType.ProjectType.Vue:
      break;

    case _ProjectType.ProjectType.Nodejs:
      break;

    case _ProjectType.ProjectType.MiniProgram:
      break;

    default:
      break;
  }

  return {
    dependencies,
    devDependencies
  };
}

async function getDependenciesVersion({
  dependencies,
  devDependencies
}) {
  const ds = {};
  const devS = {};
  [...dependencies].sort((a, b) => (a + '').localeCompare(b + '')).map(async p => {
    const version = await (0, _shelljs.exec)(`npm view ${p.trim()} version`, {
      silent: true
    });
    ds[p.trim()] = `^${version.replace('\n', '')}`;
  });
  [...devDependencies].sort((a, b) => (a + '').localeCompare(b + '')).map(async p => {
    const version = await (0, _shelljs.exec)(`npm view ${p.trim()} version`, {
      silent: true
    });
    devS[p.trim()] = `^${version.replace('\n', '')}`;
  });
  return {
    dependencies: ds,
    devDependencies: devS
  };
}

async function getPackageData(projectName, projectType, scriptingLanguageType = _ProjectType.ProjectLanguageType.Javascript, src = 'src') {
  const isTs = scriptingLanguageType === _ProjectType.ProjectLanguageType.Typescript;
  const dependenciesData = await getDependenciesVersion(getDependenciesName(projectType, isTs));
  let lint;

  if (projectType === 'normal') {
    lint = `eslint --ext .js,.ts ./${src} --fix`;
  } else if (projectType === 'react') {
    lint = isTs ? `eslint --ext .js,.jsx ./${src} --fix` : `eslint --ext .js,.ts,.tsx ./${src} --fix`;
  }

  return { ...packageData,
    ...dependenciesData,
    name: `smart-${projectName}-project`,
    scripts: { ...packageData.scripts,
      lint
    },
    smart: {
      projectType,
      scriptingLanguageType
    }
  };
}