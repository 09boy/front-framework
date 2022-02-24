import { RuleSetRule } from 'webpack';
import { getDynamicModule } from 'share/smartHelper';
import  MiniCssExtractPlugin from 'mini-css-extract-plugin';

type CssLoaderType = 'css' | 'scss' | 'less';

function getCssLoader(devMode: boolean, importLoaders = 1, loaderType: CssLoaderType):RuleSetRule[] {

  let test = /\.css$/i;
  if (loaderType === 'scss') {
    test = /\.(sa|sc)ss$/i;
  } else if (loaderType === 'less') {
    test = /\.less$/i;
  }

  const styleLoader = devMode
    ? {
      loader: getDynamicModule('style-loader'),
      options: {
        injectType: 'singletonStyleTag',
      },
    }
    : {
      loader: MiniCssExtractPlugin.loader,
      options: {}
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
          }
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
      // execute: true,
      postcssOptions: {
        plugins: [
          [
            getDynamicModule('postcss-import'),
            [getDynamicModule('postcss-short'), { prefix: 'x' }],
            [getDynamicModule('postcss-preset-env'), {
              stage: 0,
              features: {
                'nesting-rules': true,
                'color-mod-function': { unresolved: 'warn' },
                // browsers: 'last 2 versions',
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
    // fiber: false,
  } : {
    outputStyle: 'compressed'
  };
  return {
    loader: getDynamicModule('sass-loader'),
    options: {
      sourceMap: true,
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

export function getStyleLoader(isDevMode: boolean): RuleSetRule[] {
  const defaultCssImportCount = 1;
  const defaultStyleImportCount = 2;

  const sLoaders: RuleSetRule[] = getCssLoader(isDevMode, defaultStyleImportCount, 'scss').map(item => {
    if (Array.isArray(item.use)) {
      return { ...item, use: [...item.use, getSassLoader(isDevMode)] };
    }
    return item;
  });

  const lessLoaders: RuleSetRule[] = getCssLoader(isDevMode, defaultStyleImportCount, 'less').map(item => {
    if (Array.isArray(item.use)) {
      return { ...item, use: [...item.use, getLessLoader()] };
    }
    return item;
  });

  return [
    ...getCssLoader(isDevMode, defaultCssImportCount, 'css'),
    ...sLoaders,
    ...lessLoaders,
  ];
}
