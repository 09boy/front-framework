import { RuleSetRule } from 'webpack';
import { EnvType } from 'types/EnvType';
import { getDynamicModule } from 'share/tool';
import { isDevEnv } from '../tool';
import  MiniCssExtractPlugin from 'mini-css-extract-plugin';

function getCssLoader(devMode: boolean, importLoaders = 1, isLessLoader: boolean = false,):RuleSetRule[] {

  let test = !isLessLoader ? /\.(sa|sc)ss$/ : /\.less$/;
  // let lazyTest = !isLessLoader ?/\.lazy\.(sa|sc)ss$/ : /\.lazy\.less$/;

  if (importLoaders === 1 && devMode) {
    test = /\.css$/;
    // lazyTest = /\.css$/;
  }

  const styleLoader = devMode
    ? {
      loader: getDynamicModule('style-loader'),
      options: {
        insert: (element: Element) => {
          const parent = document.querySelector('body');
          // eslint-disable-next-line no-underscore-dangle
          // @ts-ignore
          let lastInsertedElement = window['_lastElementInsertedByStyleLoader'];

          if (!lastInsertedElement) {
            // @ts-ignore
            parent.insertBefore(element, parent.firstChild);
          } else if (lastInsertedElement.nextSibling) {
            // @ts-ignore
            parent.insertBefore(element, lastInsertedElement.nextSibling);
          } else {
            // @ts-ignore
            parent.appendChild(element);
          }
          // eslint-disable-next-line no-underscore-dangle
          // @ts-ignore
          window._lastElementInsertedByStyleLoader = element;
        },
        esModule: true,
        modules: {
          namedExport: true,
        },
      },
    }
    : {
      loader: MiniCssExtractPlugin.loader,
      options: {
        esModule: true,
      }
    };

  const postLoader = getPostCss();

  return [
    {
      test,
      use: [
        styleLoader,
        {
          loader: getDynamicModule('css-loader'),
          options: {
            importLoaders,
            sourceMap: true,
            esModule: true,
            url: true,
            import: true,
            modules: {
              compileType: 'module',
              mode: 'global',
              auto: true,
              namedExport: true,
              exportLocalsConvention: 'camelCase',
              exportOnlyLocals: false,
              exportGlobals: true,
              localIdentHashPrefix: 'hash',
              localIdentName: devMode ? '[name]__[local]' : '[path][name]__[local]--[hash:base64:5]',
            },
          },
        },
        postLoader,
      ],
    },
    /*{
      test: lazyTest,
      use: [
        {
          loader: getDynamicModule('style-loader'),
          options: {
            sourceMap: true,
            insert: 'body',
            injectType: 'lazySingletonStyleTag',
          },
        },
        {
          loader: getDynamicModule('css-loader'),
          options: {
            importLoaders,
            sourceMap: true,
            esModule: true,
            url: true,
            import: true,
            modules: {
              compileType: 'module',
              mode: 'global',
              auto: true,
              namedExport: true,
              exportLocalsConvention: 'camelCase',
              exportOnlyLocals: false,
              exportGlobals: true,
              localIdentHashPrefix: 'hash',
              localIdentName: devMode ? '[name]__[local]' : '[path][name]__[local]--[hash:base64:5]',
            },
          },
        },
        postLoader,
      ],
    },*/
  ];
}

function getPostCss(): RuleSetRule {
  return {
    loader: getDynamicModule('postcss-loader'),
    options: {
      sourceMap: true,
      postcssOptions: {
        /*parser: require('sugarss').parse,
        execute: true,
        syntax: require("sugarss"),*/
        plugins: [
          [
            getDynamicModule('postcss-import'),
            [getDynamicModule('postcss-short'), { prefix: 'x' }],
            [getDynamicModule('postcss-preset-env'), {
              stage: 3,
              features: {
                'nesting-rules': true,
                'color-mod-function': { unresolved: 'warn' },
                browsers: 'last 2 versions',
                autoprefixer: { grid: true },
              }
            }],
          ],
        ],
      },
    },
  };
}

function getSassLoader(devMode: Boolean): RuleSetRule {
  // Compiles Sass to CSS
  const sassOptions = devMode ? {
    fiber: false,
  } : {
    outputStyle: 'compressed'
  };
  return {
    loader: getDynamicModule('sass-loader'),
    options: {
      sourceMap: true,
        implementation: require('sass'),
        webpackImporter: false,
        sassOptions,
    },
  };
}

function getLessLoader(): RuleSetRule {
  return {
    loader: getDynamicModule('less-loader'),
    options: {
      sourceMap: true,
      lessOptions: {
        strictMath: true,
        webpackImporter: false,
        javascriptEnabled: true,
      }
    }
  };
}

/*function getProductLoader(devMode: boolean): RuleSetUseItem[] {
  if (devMode) {
    return [];
  }
  return [
    getDynamicModule('file-loader'),
    getDynamicModule('extract-loader'),
  ];
}*/

export function getStyleLoader(env: EnvType): RuleSetRule[] {
  const devMode = isDevEnv(env);
  const sLoaders: RuleSetRule[] = getCssLoader(devMode, 2).map(item => {
    if (Array.isArray(item.use)) {
      return {...item, use: [...item.use, getSassLoader(devMode)]};
    }
    return item;
  });

  const lessLoaders: RuleSetRule[] = getCssLoader(devMode, 2, true).map(item => {
    if (Array.isArray(item.use)) {
      return {...item, use: [...item.use, getLessLoader()]};
    }
    return item;
  });

  return [
    ...getCssLoader(devMode),
    ...sLoaders,
    ...lessLoaders,
  ];
}
