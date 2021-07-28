"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStyleLoader = getStyleLoader;

var _projectHelper = require("../../share/projectHelper");

var _env = require("../../share/env");

var _miniCssExtractPlugin = _interopRequireDefault(require("mini-css-extract-plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getCssLoader(devMode, importLoaders = 1, loaderType) {
  let test = /\.css$/;

  if (loaderType === 'scss') {
    test = /\.(sa|sc)ss$/;
  } else if (loaderType === 'less') {
    test = /\.less$/;
  }

  const styleLoader = devMode ? {
    loader: (0, _projectHelper.getDynamicModule)('style-loader'),
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
        namedExport: true
      }
    }
  } : {
    loader: _miniCssExtractPlugin.default.loader,
    options: {
      esModule: true,
      modules: {
        namedExport: true
      }
    }
  };
  const postLoader = getPostCss();
  return [{
    test,
    use: [styleLoader, {
      loader: (0, _projectHelper.getDynamicModule)('css-loader'),
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
          localIdentName: devMode ? '[name]__[local]' : '[path][name]__[local]--[hash:base64:5]'
        }
      }
    }, postLoader]
  }];
}

function getPostCss() {
  return {
    loader: (0, _projectHelper.getDynamicModule)('postcss-loader'),
    options: {
      sourceMap: true,
      postcssOptions: {
        /*parser: require('sugarss').parse,
        execute: true,
        syntax: require("sugarss"),*/
        plugins: [[(0, _projectHelper.getDynamicModule)('postcss-import'), [(0, _projectHelper.getDynamicModule)('postcss-short'), {
          prefix: 'x'
        }], [(0, _projectHelper.getDynamicModule)('postcss-preset-env'), {
          stage: 3,
          features: {
            'nesting-rules': true,
            'color-mod-function': {
              unresolved: 'warn'
            },
            browsers: 'last 2 versions',
            autoprefixer: {
              grid: true
            }
          }
        }]]]
      }
    }
  };
}

function getSassLoader(devMode) {
  // Compiles Sass to CSS
  const sassOptions = devMode ? {
    fiber: false
  } : {
    outputStyle: 'compressed'
  };
  return {
    loader: (0, _projectHelper.getDynamicModule)('sass-loader'),
    options: {
      sourceMap: true,
      // implementation: require('sass'),
      webpackImporter: false,
      sassOptions
    }
  };
}

function getLessLoader() {
  return {
    loader: (0, _projectHelper.getDynamicModule)('less-loader'),
    options: {
      sourceMap: true,
      lessOptions: {
        strictMath: true,
        webpackImporter: false,
        javascriptEnabled: true
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


function getStyleLoader(projectType) {
  if (projectType === 'nodejs') {
    return [];
  } // const isVue = projectType === 'vue';


  const defaultCssImportCount = 1;
  const defaultStyleImportCount = 2;
  const devMode = (0, _env.isDevEnv)();
  const sLoaders = getCssLoader(devMode, defaultStyleImportCount, 'scss').map(item => {
    if (Array.isArray(item.use)) {
      return { ...item,
        use: [...item.use, getSassLoader(devMode)]
      };
    }

    return item;
  });
  const lessLoaders = getCssLoader(devMode, defaultStyleImportCount, 'less').map(item => {
    if (Array.isArray(item.use)) {
      return { ...item,
        use: [...item.use, getLessLoader()]
      };
    }

    return item;
  });
  return [...getCssLoader(devMode, defaultCssImportCount, 'css'), ...sLoaders, ...lessLoaders];
}