"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStyleLoader = getStyleLoader;

var _smartHelper = require("../../share/smartHelper");

var _miniCssExtractPlugin = _interopRequireDefault(require("mini-css-extract-plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getCssLoader(devMode, importLoaders = 1, loaderType) {
  let test = /\.css$/i;

  if (loaderType === 'scss') {
    test = /\.(sa|sc)ss$/i;
  } else if (loaderType === 'less') {
    test = /\.less$/i;
  }

  const styleLoader = devMode ? {
    loader: (0, _smartHelper.getDynamicModule)('style-loader'),
    options: {
      injectType: 'singletonStyleTag'
    }
  } : {
    loader: _miniCssExtractPlugin.default.loader,
    options: {}
  };
  const postLoader = getPostCss();
  return [{
    test,
    use: [styleLoader, {
      loader: (0, _smartHelper.getDynamicModule)('css-loader'),
      options: {
        importLoaders,
        sourceMap: true
      }
    }, postLoader]
  }];
}

function getPostCss() {
  return {
    loader: (0, _smartHelper.getDynamicModule)('postcss-loader'),
    options: {
      sourceMap: true,
      // execute: true,
      postcssOptions: {
        plugins: [[(0, _smartHelper.getDynamicModule)('postcss-import'), [(0, _smartHelper.getDynamicModule)('postcss-short'), {
          prefix: 'x'
        }], [(0, _smartHelper.getDynamicModule)('postcss-preset-env'), {
          stage: 0,
          features: {
            'nesting-rules': true,
            'color-mod-function': {
              unresolved: 'warn'
            },
            // browsers: 'last 2 versions',
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
    loader: (0, _smartHelper.getDynamicModule)('sass-loader'),
    options: {
      sourceMap: true,
      webpackImporter: false,
      sassOptions
    }
  };
}

function getLessLoader() {
  return {
    loader: (0, _smartHelper.getDynamicModule)('less-loader'),
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

function getStyleLoader(isDevMode) {
  const defaultCssImportCount = 1;
  const defaultStyleImportCount = 2;
  const sLoaders = getCssLoader(isDevMode, defaultStyleImportCount, 'scss').map(item => {
    if (Array.isArray(item.use)) {
      return { ...item,
        use: [...item.use, getSassLoader(isDevMode)]
      };
    }

    return item;
  });
  const lessLoaders = getCssLoader(isDevMode, defaultStyleImportCount, 'less').map(item => {
    if (Array.isArray(item.use)) {
      return { ...item,
        use: [...item.use, getLessLoader()]
      };
    }

    return item;
  });
  return [...getCssLoader(isDevMode, defaultCssImportCount, 'css'), ...sLoaders, ...lessLoaders];
}