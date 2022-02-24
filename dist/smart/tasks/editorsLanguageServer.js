"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTsTypingFile = createTsTypingFile;
exports.getLSPData = getLSPData;

var _promises = require("fs/promises");

/*
* While it appears this has originated from VsCode, any editor using LSP will
* make use of jsconfig.json including VsCode, SublimeText and so on.
* */

/*
 * ref: https://code.visualstudio.com/docs/languages/jsconfig
* website: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
* options: https://www.typescriptlang.org/tsconfig
* */
const defaultData = {
  compilerOptions: {
    baseUrl: './src',
    paths: {},
    module: 'esnext',
    target: 'esnext',
    strict: true,
    allowUmdGlobalAccess: true
  },
  exclude: ['node_modules', '**/node_modules']
};

function getLSPData(type, sType, alias) {
  const root = alias.root + '/';
  defaultData.compilerOptions.baseUrl = '.';

  if (type === 'react') {
    defaultData.compilerOptions.jsx = 'react';
  }

  if (sType === 'ts') {
    // defaultData.include.push('typings.d.ts');
    defaultData.exclude.push('**/*.spec.ts');
    defaultData.compilerOptions.types = ['node', 'jest', 'webpack-env']; // module.hot

    defaultData.compilerOptions.allowJs = true;
    defaultData.compilerOptions.resolveJsonModule = true; // for json

    defaultData.compilerOptions.allowSyntheticDefaultImports = true;
    defaultData.compilerOptions.moduleResolution = "node";
    defaultData.compilerOptions.typeRoots = ['./node_modules/@types', './typings.d.ts'];
  }

  for (const k in alias) {
    if (k !== 'root' && Object.hasOwnProperty.call(alias, k)) {
      const value = root + alias[k] + '/*';
      defaultData.compilerOptions.paths[k + '/*'] = [value];
    }
  }

  defaultData.compilerOptions.paths['test/*'] = ['__test__/*'];
  return JSON.stringify(defaultData, null, 2);
}

const defaultTsTyping = ["declare module '*.jpg';", "declare module '*.jpeg';", "declare module '*.png';", "declare module '*.webp';", "declare const SMART_ENV: string | Record<string, string>;"];

async function createTsTypingFile(path) {
  await (0, _promises.writeFile)(path, defaultTsTyping.join('\n'), 'utf-8');
}