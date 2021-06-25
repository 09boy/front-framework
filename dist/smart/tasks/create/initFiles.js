"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initFiles = initFiles;

var _fs = require("fs");

var _path = require("path");

var _shelljs = require("shelljs");

var _getAppTemplateData = require("./getAppTemplateData");

function initFiles({
  projectType,
  scriptType
}, structure) {
  const {
    src,
    pages
  } = structure;
  const pagesPath = `${src}/${pages}`;
  let fileSuffixName = scriptType;

  if (projectType === 'react' || projectType === 'vue') {
    const appPath = `${src}/app`;

    if (projectType === 'react') {
      fileSuffixName = fileSuffixName + 'x';
    }

    (0, _shelljs.cp)('-R', (0, _path.join)(__dirname, '..', '..', '/templates/', projectType, '/', scriptType, '/app/*'), appPath);
    (0, _shelljs.cp)('-R', (0, _path.join)(__dirname, '..', '..', '/templates/', projectType, '/', scriptType, '/home'), pagesPath);
    (0, _shelljs.cp)('-R', (0, _path.join)(__dirname, '..', '..', '/templates/', projectType, '/', scriptType, '/route.config.' + fileSuffixName), pagesPath);
  }

  if (projectType === 'normal') {
    (0, _shelljs.cp)('-R', (0, _path.join)(__dirname, '..', '..', '/templates/', projectType, 'common.scss'), `${src}/assets/styles`);
  }

  let {
    indexData,
    appData
  } = (0, _getAppTemplateData.getTemplateData)(projectType, scriptType);
  indexData = indexData.replace(/<pagesPath>/g, pages);
  appData = appData.replace(/<appPath>/g, 'app');
  (0, _fs.writeFileSync)(`index.${scriptType}`, indexData, 'utf-8');
  (0, _fs.writeFileSync)(pagesPath + '/app.' + fileSuffixName, appData, 'utf-8');
}