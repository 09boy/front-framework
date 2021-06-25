import { RuleSetRule } from 'webpack';
import { Options } from '@babel/preset-env';
import { isDevEnv } from 'share/env';
import { getDynamicModule } from 'share/projectHelper';
import { SmartProjectOption } from 'types/Smart';
import { join } from 'path';


export function getTranspilingLoader({ scriptType, projectType }: SmartProjectOption): RuleSetRule[] {
  const devMode = isDevEnv();
  const isTs = scriptType === 'ts';
  const isReact = projectType === 'react';

  let envOptions: Options = {
    targets: 'defaults',
    loose: true,
    useBuiltIns: 'entry',
    corejs: { version: 3, proposals: true },
    bugfixes: devMode,
  };

  const presets = [];

  const plugins = [
    getDynamicModule('@babel/plugin-transform-runtime'),
    [getDynamicModule('@babel/plugin-proposal-decorators'), { legacy: true }],
    [getDynamicModule('@babel/plugin-proposal-class-properties'), { loose: true }],
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

  console.log(presets);
  return [
    {
      test: /\.(ts|js)x?$/,
      use: {
        loader: getDynamicModule('babel-loader'),
        options: {
          babelrc: false,
          cacheDirectory: true,
          presets,
          plugins,
        }
      }
    }
  ];
}
