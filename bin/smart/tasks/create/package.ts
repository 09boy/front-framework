import { exec } from 'shelljs';
import { ProjectType } from 'types/SmartProjectConfig';
import { SmartProjectOption } from 'types/Smart';

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
  },
};

type DependenciesType = {
  dependencies: string[];
  devDependencies: string[];
};

const commonsDev = ['jest', 'babel-jest', 'pre-commit', 'eslint-plugin-import', 'eslint-import-resolver-babel-module', 'eslint', 'babel-plugin-module-resolver', 'babel-plugin-add-module-exports'];

function getDependenciesName(projectType: ProjectType, isTs: boolean): DependenciesType {
  let dependencies: string[] = [];
  let devDependencies: string[] = isTs ?
    ['typescript', '@typescript-eslint/parser',
      '@typescript-eslint/eslint-plugin',
      'ts-jest', '@types/jest', ...commonsDev]
    : ['@babel/eslint-parser', ...commonsDev];

  switch (projectType) {
    case 'normal':
      dependencies = ['moment'];
      break;
    case 'react':
      dependencies = ['moment', 'react', '@hot-loader/react-dom', '@reduxjs/toolkit', 'redux-saga', 'reselect', 'redux-logger', 'react-redux', 'react-router-dom'];
      devDependencies = [...devDependencies, 'eslint-plugin-react', 'eslint-plugin-react-hooks', 'eslint-plugin-jsx-a11y', 'react-test-renderer', 'prop-types'];
      if (isTs) {
        devDependencies.push('@types/react', '@types/react-redux', '@types/redux-logger', '@types/react-router-dom');
      }
      break;
    case 'vue':
      break;
    case 'nodejs':
      break;
    case 'miniProgram':
      break;
    default:
      break;
  }
  return {
    dependencies,
    devDependencies,
  };
}

function getDependenciesVersion({ dependencies, devDependencies }: DependenciesType ): {
  dependencies: Record<string, string>,
  devDependencies: Record<string, string>
} {
  const ds: Record<string, string> = {};
  const devS: Record<string, string> = {};

  [...dependencies].sort((a, b) => (a + '').localeCompare(b + '')).map(((p) => {
    const version = exec(`npm view ${p.trim()} version`, { silent: true });
    ds[p.trim()] = `^${version.replace('\n', '')}`;
  }));
  [...devDependencies].sort((a, b) => (a + '').localeCompare(b + '')).map((p) => {
    const version = exec(`npm view ${p.trim()} version`, { silent: true });
    devS[p.trim()] = `^${version.replace('\n', '')}`;
  });

  return {
    dependencies: ds,
    devDependencies: devS,
  };
}

export function getPackageData({ projectType, scriptType, dirName } :SmartProjectOption, src: string): Record<string, any> {
  const isTs = scriptType === 'ts';
  const dependenciesData = getDependenciesVersion(getDependenciesName(projectType, isTs));
  let lint;
  if (projectType === 'normal') {
    lint = `eslint --ext .js,.ts ./${src} --fix`;
  } else if (projectType === 'react') {
    lint =  isTs ? `eslint --ext .js,.jsx ./${src} --fix` : `eslint --ext .js,.ts,.tsx ./${src} --fix`;
  }

  return {
    ...packageData,
    ...dependenciesData,
    name: `smart-${dirName}-project`,
    scripts: {
      ...packageData.scripts,
      lint,
    },
    smart: {
      projectType,
      scriptType,
    },
  };
}
