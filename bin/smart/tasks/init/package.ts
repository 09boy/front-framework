import { exec } from 'shelljs';
import { ProjectType } from 'types/SmartProjectConfig';
import { SmartProjectOption } from 'types/Smart';

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
  nodemonConfig: {},
  smart: {}
};

const commondev = ['moment', 'axios'];
const commonsDev = [
  '@babel/core',
  '@babel/runtime',
  'eslint',
  'eslint-config-prettier',
  'eslint-plugin-import',
  'eslint-import-resolver-babel-module',
  'eslint',
  'babel-plugin-module-resolver',
  'babel-plugin-add-module-exports',
  'prettier',
  'pretty-quick',
];

const commonTsDev = [
  '@types/jest',
  '@typescript-eslint/eslint-plugin',
  'eslint-config-airbnb-typescript',
  '@typescript-eslint/parser',
  'typescript',
];

const commonReact = [
  'react',
  'react-dom',
  'redux',
  'react-redux',
  'redux-saga',
  'react-router-dom',
  'redux-logger',
];

const commonReactDev = [
  'eslint-plugin-react',
  'react-test-renderer',
  'react-hot-loader',
  'prop-types',
];

const commonReactTsDev = [
  '@types/react',
  '@types/react-dom',
  '@types/react-redux',
  '@types/react-router-dom',
  '@types/redux-logger',
  '@react-native-community/eslint-config',
  '@types/react-test-renderer',
];

const commonNode = [
  'connect-mongo',
  'body-parser',
  'express',
  'cookie-parser',
  'express',
  'express-fileupload',
  'express-session',
  'mongoose',
  'mongoose-paginate-v2',
  'node-fetch',
  'jsonwebtoken',
];

const commonNodeDev = [
  '@babel/node',
  'mongodb-memory-server',
  'nodemon',
  'ts-node',
];

const commonNodeTsDev = [
  '@types/cookie-parser',
  '@types/express',
  '@types/express-fileupload',
  '@types/express-session',
  '@types/jsonwebtoken',
  '@types/mongoose-paginate-v2',
  '@types/node',
  '@types/node-fetch',
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser'
];

const commonVue = [
  'vue@3',
  'vuex@4',
  'vue-router@4'
];

type DependenciesType = {
  dependencies: string[];
  devDependencies: string[];
};

function getDependenciesName(projectType: ProjectType, isTs: boolean): DependenciesType {
  let dependencies: string[] = [...commondev];
  let devDependencies: string[] = [...commonsDev];

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
      dependencies = dependencies.concat(commonNode).filter(s => s!== 'axios');
      devDependencies = devDependencies.concat(isTs ? [...commonNodeDev, ...commonNodeTsDev] : commonNodeDev);
      break;
    case 'miniProgram':
      break;
    default:
      // normal
      devDependencies.push(isTs? '@typescript-eslint/parser' : '@babel/eslint-parser');
      break;
  }
  return {
    dependencies: [...new Set(dependencies)],
    devDependencies: [...new Set(devDependencies)],
  };
}

async function getDependenciesVersion({ dependencies, devDependencies }: DependenciesType ): Promise<{
  dependencies: Record<string, string>,
  devDependencies: Record<string, string>
}> {
  const ds: Record<string, string> = {};
  const devS: Record<string, string> = {};

  await Promise.all([...dependencies].sort((a, b) => (a + '').localeCompare(b + '')).map(p => new Promise<void>(resolve => {
    exec(`npm view ${p.trim()} version`, { silent: true, async: true }).stdout?.on('data', version => {
      if (p.includes('vue') && p.includes('@')) {
        p = p.split('@')[0];
        version = (version as string).replace(/'/g, '');
      }
      ds[p.trim()] = `^${(version as string).trim()}`;
      resolve();
    });
  })));

  await Promise.all([...devDependencies].sort((a, b) => (a + '').localeCompare(b + '')).map(p => new Promise<void>(resolve => {
    exec(`npm view ${p.trim()} version`, { silent: true, async: true }).stdout?.on('data', version => {
      devS[p.trim()] = `^${(version as string).trim()}`;
      resolve();
    });
  })));

  return {
    'dependencies': ds,
    'devDependencies': devS,
  };
}

export default async function getPackageData({ projectType, scriptType, dirName } :SmartProjectOption, src: string, buildDir?: string): Promise<Partial<typeof packageData>> {
  const isTs = scriptType === 'ts';
  const dependenciesData = await getDependenciesVersion(getDependenciesName(projectType, isTs));

  console.log(projectType, scriptType, dirName, src, buildDir, '==== init');

  let lint = `tsc --noEmit && eslint --ext .js,.ts ./${src} --fix`; // normal and nodejs
  if (projectType === 'react') {
    lint = `tsc --noEmit && eslint --ext .js, .jsx, .ts, .tsx ./${src} --fix`;
  }

  const nodejsScripts = {};
  const nodemonConfig = {};
  if (projectType === 'nodejs') {
    Object.assign(nodejsScripts, {
      start: 'tsc --noEmit && nodemon',
      transpile: `npx babel ${src} index.${scriptType} --out-dir ${buildDir || 'dist'} --extensions '.${scriptType}' --copy-files`,
    });

    Object.assign(nodemonConfig, {
      "verbose": true,
      "ignore": [
        "node_modules/*",
        `${buildDir || 'dist'}/!*`,
        "__tests__/!*"
      ],
      "watch": [
        "index.${scriptType}",
        src,
      ],
      "ext": isTs ? "js, ts" : 'js',
      "exec": "npm run transpile",
      "delay": 2500
    });
  }

  return {
    ...packageData,
    name: `smart-${dirName}-project`,
    scripts: {
      ...packageData.scripts,
      lint,
      ...nodejsScripts,
    },
    ...dependenciesData,
    nodemonConfig,
    smart: {
      projectType,
      scriptType,
    },
  };
}
