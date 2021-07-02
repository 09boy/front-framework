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
    loader: (0, _projectHelper.getDynamicModule)('style-loader')
  } : {
    loader: _miniCssExtractPlugin.default.loader,
    options: {
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
        modules: {
          compileType: 'module',
          mode: 'global',
          auto: true,
          namedExport: true,
          exportLocalsConvention: 'camelCase',
          exportOnlyLocals: false,
          exportGlobals: true,
          // localIdentContext: PROJECT_ROOT_PATH + '/src',
          localIdentHashPrefix: 'hash',
          localIdentName: devMode ? '[name]' : '[path][name]__[local]--[hash:base64:5]'
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
      // execute: true,
      postcssOptions: {
        /*parser: require('sugarss').parse,
        execute: true,
        syntax: require("sugarss"),*/
        plugins: [[(0, _projectHelper.getDynamicModule)('postcss-import'), [(0, _projectHelper.getDynamicModule)('postcss-short'), {
          prefix: 'x'
        }], [(0, _projectHelper.getDynamicModule)('postcss-preset-env'), {
          stage: 0,
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
  const sassOptions = devMode ? {// fiber: false,
  } : {
    outputStyle: 'compressed'
  };
  return {
    loader: (0, _projectHelper.getDynamicModule)('sass-loader'),
    options: {
      sourceMap: true,
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
  }

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