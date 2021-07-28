import { RuleSetRule } from 'webpack';
import { getDynamicModule } from 'share/projectHelper';
import { isDevEnv } from 'share/env';
import  MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ProjectType } from "types/SmartProjectConfig";

type CssLoaderType = 'css' | 'scss' | 'less';

function getCssLoader(devMode: boolean, importLoaders = 1, loaderType: CssLoaderType):RuleSetRule[] {

  let test = /\.css$/;
  if (loaderType === 'scss') {
    test = /\.(sa|sc)ss$/;
  } else if (loaderType === 'less') {
    test = /\.less$/;
  }

  const styleLoader = devMode
    ? {
      loader: getDynamicModule('style-loader'),
      options: {
       /* insert: (element: Element) => {
          const parent = document.querySelector('body');
          // eslint-disable-next-line no-underscore-dangle
          // @ts-ignore
          const lastInsertedElement = window['_lastElementInsertedByStyleLoader'];

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
        },*/
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
        modules: {
          namedExport: true,
        },
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

function getSassLoader(devMode: boolean): RuleSetRule {
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
        // implementation: require('sass'),
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

export function getStyleLoader(projectType: ProjectType): RuleSetRule[] {
  if (projectType === 'nodejs') {
    return [];
  }
  // const isVue = projectType === 'vue';
  const defaultCssImportCount = 1;
  const defaultStyleImportCount = 2;
  const devMode = isDevEnv();

  const sLoaders: RuleSetRule[] = getCssLoader(devMode, defaultStyleImportCount, 'scss').map(item => {
    if (Array.isArray(item.use)) {
      return { ...item, use: [...item.use, getSassLoader(devMode)] };
    }
    return item;
  });

  const lessLoaders: RuleSetRule[] = getCssLoader(devMode, defaultStyleImportCount, 'less').map(item => {
    if (Array.isArray(item.use)) {
      return { ...item, use: [...item.use, getLessLoader()] };
    }
    return item;
  });

  return [
    ...getCssLoader(devMode, defaultCssImportCount, 'css'),
    ...sLoaders,
    ...lessLoaders,
  ];
}
