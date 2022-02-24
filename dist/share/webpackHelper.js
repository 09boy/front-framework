"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAlias = getAlias;
exports.getExtensions = getExtensions;
exports.getGlobalEnvVar = getGlobalEnvVar;
exports.hasBabelConfigFile = hasBabelConfigFile;
exports.parseConfigData = parseConfigData;

var _fs = require("fs");

var _path = require("./path");

// function getEntryFilePath(sType: ScriptType): string {
//   let path;
//   if (existsSync(`${PROJECT_ROOT_PATH}/index.js`)) {
//     path = `${PROJECT_ROOT_PATH}/index.js`;
//   } else if (existsSync(`${PROJECT_ROOT_PATH}/index.ts`)) {
//     path = `${PROJECT_ROOT_PATH}/index.ts`;
//   } else {
//     path = `${PROJECT_ROOT_PATH}/index.${sType}`;
//     writeFileSync(path, '', 'utf-8');
//   }
//   return path;
// }
function getEntryAndOutData(scriptType, type, port, host = '127.0.0.1', publicPath = '/', buildDir = '/dist') {
  return {
    entryPath: `${_path.PROJECT_ROOT_PATH}/index`,
    isDevMode: true,
    projectType: type,
    host,
    port,
    publicPath,
    buildPath: buildDir.includes('/') ? `${_path.PROJECT_ROOT_PATH}${buildDir}` : `${_path.PROJECT_ROOT_PATH}/${buildDir}`,
    name: 'smart-app'
  };
}

function getPluginsData(entryPath, publicPath = '/', title, favicon, globalVar, provide, eslintEnabled) {
  return {
    entryPath,
    publicPath,
    title,
    favicon: favicon ? _path.PROJECT_ROOT_PATH + '/src/assets/' + favicon : undefined,
    globalVar,
    provide,
    eslintEnabled: !!eslintEnabled
  };
}

function parseConfigData(data) {
  const {
    scriptType,
    type,
    host,
    port,
    publicPath,
    buildDir,
    favicon,
    globalVar,
    provide,
    eslintEnabled
  } = data;
  const entryAndOutput = getEntryAndOutData(scriptType, type, port, host, publicPath, buildDir);
  return {
    type,
    scriptType,
    entryAndOutput,
    plugins: getPluginsData(entryAndOutput.entryPath, publicPath, undefined, favicon, globalVar, provide, eslintEnabled)
  };
}

function getAlias(alias) {
  if (!alias) {
    return {
      src: `${_path.PROJECT_ROOT_PATH}/src/`,
      assets: `${_path.PROJECT_ROOT_PATH}/src/assets/`,
      pages: `${_path.PROJECT_ROOT_PATH}/src/pages/`
    };
  }

  const root = `${_path.PROJECT_ROOT_PATH}/${alias.root ? alias.root.replace(/\//g, '') : 'src'}`;
  const obj = {
    src: root
  };

  for (const key in alias) {
    if (key !== 'root' && Object.hasOwnProperty.call(alias, key)) {
      const value = alias[key] || key;
      obj[key] = `${root}/${value}/`;
    }
  }

  return obj;
}

function getExtensions(type, sType) {
  const files = ['.js', '.jsx', '.json', '.css', '.scss', '.less'];
  const isTs = sType === 'ts';

  if (isTs) {
    files.push('.ts', '.tsx');
  } // default extensions


  files.push('...');
  return files;
}

function getGlobalEnvVar(mode) {
  if (!mode) {
    return {};
  }

  const modeEnv = process.env.__MODE__ || 'start';
  const envs = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    SMART_ENV: mode[modeEnv] || '//' // parse Built-in

  };
  const customKey = `${modeEnv}-`;

  for (const key in mode) {
    if (Object.hasOwnProperty.call(mode, key)) {
      if (key.includes(customKey)) {
        // parse custom
        const id = key.split('-')[1].toUpperCase(); // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

        envs[`SMART_ENV_${id}`] = mode[key];
      }
    }
  }

  return envs;
}

function hasBabelConfigFile() {
  return (0, _fs.existsSync)(`${_path.PROJECT_ROOT_PATH}/babel.config.js`) || (0, _fs.existsSync)(`${_path.PROJECT_ROOT_PATH}/babel.config.json`);
}