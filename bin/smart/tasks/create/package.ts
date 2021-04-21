import { exec } from 'shelljs';
import { ProjectLanguageType, ProjectType } from 'types/ProjectType';

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

function getDependenciesName(projectType: ProjectType, isTs: Boolean): DependenciesType {
  let dependencies: string[] = [];
  let devDependencies: string[] = isTs ?
    ['typescript', '@typescript-eslint/parser',
      '@typescript-eslint/eslint-plugin',
      'ts-jest', '@types/jest', ...commonsDev]
    : ['@babel/eslint-parser', ...commonsDev];

  switch (projectType) {
    case ProjectType.Unknown:
    case ProjectType.Normal:
      dependencies = ['moment'];
      break;
    case ProjectType.React:
      dependencies = ['moment', 'react', '@hot-loader/react-dom', '@reduxjs/toolkit', 'redux-saga', 'reselect', 'redux-logger', 'react-redux', 'react-router-dom'];
      devDependencies = [...devDependencies, 'eslint-plugin-react', 'eslint-plugin-react-hooks', 'eslint-plugin-jsx-a11y', 'react-test-renderer', 'prop-types'];
      if (isTs) {
        devDependencies.push('@types/react', '@types/react-redux', '@types/redux-logger', '@types/react-router-dom');
      }
      break;
    case ProjectType.Vue:
      break;
    case ProjectType.Nodejs:
      break;
    case ProjectType.MiniProgram:
      break;
    default:
      break;
  }
  return {
    dependencies,
    devDependencies,
  };
}

async function getDependenciesVersion({ dependencies, devDependencies }: DependenciesType ): Promise<DependenciesType> {
  const ds: any = {};
  const devS: any = {};

  [...dependencies].sort((a, b) => (a + '').localeCompare(b + '')).map((async (p) => {
    const version = await exec(`npm view ${p.trim()} version`, { silent: true });
    ds[p.trim()] = `^${version.replace('\n', '')}`;
  }));
  [...devDependencies].sort((a, b) => (a + '').localeCompare(b + '')).map(async (p) => {
    const version = await exec(`npm view ${p.trim()} version`, { silent: true });
    devS[p.trim()] = `^${version.replace('\n', '')}`;
  });

  return {
    dependencies: ds,
    devDependencies: devS,
  };
}

export async function getPackageData(projectName: string, projectType: ProjectType, scriptingLanguageType: ProjectLanguageType = ProjectLanguageType.Javascript, src: string = 'src'): Promise<object> {
  const isTs = scriptingLanguageType === ProjectLanguageType.Typescript;
  const dependenciesData = await getDependenciesVersion(getDependenciesName(projectType, isTs));
  let lint;
  if (projectType === 'normal') {
    lint = `eslint --ext .js,.ts ./${src} --fix`;
  } else if (projectType === 'react') {
    lint =  isTs ? `eslint --ext .js,.jsx ./${src} --fix` : `eslint --ext .js,.ts,.tsx ./${src} --fix`;
  }

  return {
    ...packageData,
    ...dependenciesData,
    name: `smart-${projectName}-project`,
    scripts: {
      ...packageData.scripts,
      lint,
    },
    smart: {
      projectType,
      scriptingLanguageType,
    },
  };
}
