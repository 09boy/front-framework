"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAssetsPath = getAssetsPath;
exports.getResolveAlias = getResolveAlias;
exports.getResolveExtensions = getResolveExtensions;

var _shelljs = require("shelljs");

var _projectHelper = require("./projectHelper");

var _path = require("./path");

function getResolveExtensions(projectType, scriptType) {
  const extensions = [];

  switch (projectType) {
    case "react":
      {
        extensions.push('.js', '.jsx', '.css', '.scss', '.less');

        if (scriptType === 'ts') {
          extensions.unshift('.ts', '.tsx');
        }

        return extensions;
      }

    case "vue":
      {
        extensions.push('.js', '.css', '.scss', '.less', '.vue');

        if (scriptType === 'ts') {
          extensions.unshift('.ts');
        }

        return extensions;
      }

    case "nodejs":
      {
        extensions.push('.js', '.mjs');

        if (scriptType === 'ts') {
          extensions.unshift('.ts');
        }

        return extensions;
      }

    case "miniProgram":
      {
        extensions.push('.js', '.css', '.scss', '.less');

        if (scriptType === 'ts') {
          extensions.unshift('.ts');
        }

        return extensions;
      }

    case "normal":
    default:
      {
        extensions.push('.js', '.css', '.scss', '.less', '.mjs');

        if (scriptType === 'ts') {
          extensions.unshift('.ts');
        }

        return extensions;
      }
  }
}

function getResolveAlias(projectType, srcDir) {
  const resolveAlias = {};
  const srcDirs = (0, _shelljs.ls)('-d', `${srcDir}/*`).stdout.trim().split('\n');
  srcDirs.map(p => {
    const dirKey = p.split('/')[1];
    Object.assign(resolveAlias, {
      [dirKey]: `${_path.PROJECT_ROOT_PATH}/${p}`
    });
  });
  const alias = {
    '@babel/runtime-corejs3': (0, _projectHelper.getDynamicModule)('@babel/runtime-corejs3'),
    ...resolveAlias
  };

  if (projectType === 'react') {
    Object.assign(alias, {
      'react': _path.PROJECT_ROOT_PATH + '/node_modules/react',
      'react-dom': _path.PROJECT_ROOT_PATH + '/node_modules/react-dom' // 'react-dom': PROJECT_ROOT_PATH + '/node_modules/@hot-loader/react-dom',
      // '@hot-loader/react-dom': PROJECT_ROOT_PATH + '/node_modules/@hot-loader/react-dom',

    });
  }

  if (projectType === 'vue') {
    Object.assign(alias, {
      vue: _path.PROJECT_ROOT_PATH + '/node_modules/vue/dist/vue.esm-bundler.js'
    });
  }

  return alias;
}

function getAssetsPath({
  assets
}) {
  if (typeof assets === 'string') {
    return {
      assetsPath: assets
    };
  }

  return {
    assetsPath: 'assets/',
    imagePath: `assets/${assets.images || 'images'}`,
    fontsPath: `assets/${assets.fonts || 'fonts'}`,
    mediasPath: `assets/${assets.media || 'medias'}`,
    svgPath: `assets/${assets.svg || 'svg'}`
  };
}