import { ProjectType, ScriptType } from 'types/SmartType';

const packageData: Record<string, any> = {
  name: '',
  version: '1.0.0',
  scripts: {
    start: 'smart start',
    buildTest: 'smart build dev',
    buildProd: 'smart build prod',
    test: 'jest --version',
  },
  browserslist: [
    'defaults',
    'not IE 11',
    'maintained node versions'
  ],
  license: 'ISC',
  repository: {
    type: 'git',
    url: 'https://github.com/09boy/front-framework.git'
  },
  homepage: 'https://github.com/09boy/front-framework.git',
  author: '09boy'
};

function getDependencies(type: ProjectType, sType: ScriptType): {
  dependencies: string[];
  devDependencies: string[];
} {
  const names: string[] = [
    '@babel/runtime', // use babel-transform-runtime
  ];
  const devNames: string[] = ['eslint', 'eslint-plugin-import'];
  const isTs = sType === 'ts';

  if (isTs) {
    devNames.push('typescript',
      '@types/node',
      '@types/webpack-env',
      '@typescript-eslint/parser',
      '@typescript-eslint/eslint-plugin',
      '@babel/preset-typescript');
  } else {
    devNames.push('@babel/eslint-parser');
  }

  switch (type) {
    case 'normal':
      break;
    case 'react':
      devNames.push('eslint-plugin-react', 'eslint-plugin-react-hooks', 'eslint-plugin-jsx-a11y', '@babel/preset-react',
        '@types/react', '@types/react-dom');
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
    devDependencies: devNames,
  };
}


export function getPackageData(type: ProjectType, sType: ScriptType): {
  packageData: Record<string, any>;
  dependencies: string[];
  devDependencies: string[];
} {
  return {
    packageData,
    ...getDependencies(type, sType),
  };
}