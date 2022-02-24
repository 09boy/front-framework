import { ProjectType, ScriptType } from 'types/SmartType';
import { RuleSetRule } from 'webpack';
import { Options } from '@babel/preset-env';
import { getDynamicModule } from 'share/smartHelper';
import { hasBabelConfigFile } from 'share/webpackHelper';

export function getTranspilingLoader(devMode: boolean, projectType: ProjectType, scriptType: ScriptType): RuleSetRule[] {
  const hasCustomBabelConfig = hasBabelConfigFile();
  const loaderOption: Record<string, any> = {};

  if (!hasCustomBabelConfig) {
    const isTs = scriptType === 'ts';
    const isReact = projectType === 'react';

    const envOptions: Options = {
      // targets: 'defaults', config in package.json
      loose: true,
      useBuiltIns: 'entry',
      corejs: { version: 3, proposals: true },
      bugfixes: devMode,
      // debug: devMode,
    };

    const presets: string | any[] = [[getDynamicModule('@babel/preset-env'), envOptions]];
    const plugins: string | any[] = [
      [getDynamicModule('@babel/plugin-transform-runtime'), { regenerator: false }],
      //
      [getDynamicModule('@babel/plugin-proposal-decorators'), { legacy: true }],
      [getDynamicModule('@babel/plugin-proposal-class-properties'), { loose: true }],
    ];

    if (isReact) {
      presets.push([getDynamicModule('@babel/preset-react'), {
        development: devMode,
      }]);
    }

    if (devMode) {
      if (isReact) {
        presets.push(getDynamicModule('@babel/preset-flow'));
        plugins.push(
          getDynamicModule('@babel/plugin-transform-react-jsx-self'),
          getDynamicModule('@babel/plugin-transform-react-jsx-source'),
          getDynamicModule('react-hot-loader/babel'));
      }

    } else {
      //
    }


    if (isTs) {
      presets.push(
        [getDynamicModule('@babel/preset-typescript'), { onlyRemoveTypeImports: true, allowDeclareFields: true }], //It includes   @babel/plugin-transform-typescript
      );
    }


    // getDynamicModule('@babel/plugin-syntax-dynamic-import'),
    // getDynamicModule('@babel/plugin-proposal-async-generator-functions'),

    // https://blog.liuyunzhuge.com/2019/09/04/babel%E8%AF%A6%E8%A7%A3%EF%BC%88%E4%BA%94%EF%BC%89-polyfill%E5%92%8Cruntime/
    // https://github.com/babel/babel/issues/10008
    // https://github.com/babel/babel/issues/9853
    // https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md

    loaderOption.presets = presets;
    loaderOption.plugins = plugins;
  }
  // console.log(loaderOption);
  const loaders: RuleSetRule[] = [
    {
      test: /\.(ts|js)x?$/,
      use: {
        loader: getDynamicModule('babel-loader'),
        options: loaderOption
      }
    },
  ];

  if (projectType === 'vue') {
    loaders.push({
      test: /\.vue$/,
      loader: getDynamicModule('vue-loader'),
    });

    loaders.push({
      test: /\.pug$/,
      loader: getDynamicModule('pug-plain-loader'),
    });
  }

  return loaders;
}
