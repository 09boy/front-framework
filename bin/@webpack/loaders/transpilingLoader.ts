import { RuleSetRule } from 'webpack';
import { Options } from '@babel/preset-env';
import { EnvType } from 'types/EnvType';
import { isDevEnv } from '../tool';
import { getDynamicModule } from 'share/tool';
import { ProjectLanguageType, ProjectType } from 'types/ProjectType';


export function getTranspilingLoader(env: EnvType, projectType: ProjectType, projectLanguageType: ProjectLanguageType): RuleSetRule[] {
  const devMode = isDevEnv(env);
  const isTs = projectLanguageType === ProjectLanguageType.Typescript;
  const isReact = projectType === 'react';

  let envOptions: Options = {
    targets: 'defaults',
    loose: true,
    useBuiltIns: 'entry',
    corejs: { version: 3, proposals: true },
    bugfixes: devMode,
  };

  const presets: any = [];

  const plugins: string | any[] = [
    getDynamicModule('@babel/plugin-transform-runtime'),
    [getDynamicModule('@babel/plugin-proposal-decorators'), { legacy: true }],
    [getDynamicModule('@babel/plugin-proposal-class-properties'), {loose: true}],
    getDynamicModule('@babel/plugin-syntax-dynamic-import'),
    getDynamicModule('@babel/plugin-proposal-async-generator-functions'),
  ];

  if (isReact) {
    plugins.push(
      getDynamicModule('@babel/plugin-syntax-jsx'),
      getDynamicModule('@babel/plugin-transform-react-jsx'),
      getDynamicModule('@babel/plugin-transform-react-display-name'),
    );

    if (devMode) {
      plugins.push(getDynamicModule('@babel/plugin-transform-react-jsx-self'), getDynamicModule('@babel/plugin-transform-react-jsx-source'), getDynamicModule('react-hot-loader/babel'));
    }

    presets.push(
      [getDynamicModule('@babel/preset-react'), { development: devMode }],
      getDynamicModule('@babel/preset-flow')
    );
  }

  if (isTs) {
    presets.push(
      [getDynamicModule('@babel/preset-typescript'), { onlyRemoveTypeImports: true, allowDeclareFields: true }], //It includes   @babel/plugin-transform-typescript
    );
  }

  if (!devMode) {
    envOptions = {
      ...envOptions,
      debug: false,
      modules: false,
    };
  }

  presets.unshift([
    // https://github.com/babel/babel/issues/10008
    // https://github.com/babel/babel/issues/9853
    getDynamicModule('@babel/preset-env'), envOptions
  ]);

  return [
    {
      test: /\.(ts|js)x?$/,
      use: {
        loader: getDynamicModule('babel-loader'),
        options: {
          // extends: PROJECT_ROOT_PATH + '/babel.config.js',
          cacheDirectory: true,
          presets,
          plugins,
        }
      }
    }
  ];
}
