"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initFiles = initFiles;

var _fs = require("fs");

var _path = require("path");

var _shelljs = require("shelljs");

var _projectHelper = require("../../../share/projectHelper");

var _getAppTemplateData = require("./getAppTemplateData");

function initFiles({
  projectType,
  scriptType
}, structure) {
  const {
    pagesPath,
    appPath
  } = (0, _projectHelper.getProjectStructurePath)(structure);
  const isTs = scriptType === 'ts';
  let fileSuffixName = scriptType;

  if (projectType === 'react') {
    fileSuffixName = fileSuffixName + 'x';
    (0, _shelljs.cp)('-R', (0, _path.join)(__dirname, '..', '..', '/templates/', projectType, '/', scriptType, '/app/*'), appPath);
    (0, _shelljs.cp)('-R', (0, _path.join)(__dirname, '..', '..', '/templates/', projectType, '/', scriptType, '/home'), pagesPath);
    (0, _shelljs.cp)('-R', (0, _path.join)(__dirname, '..', '..', '/templates/', projectType, '/', scriptType, '/route.config.' + fileSuffixName), pagesPath);

    if (isTs) {
      (0, _shelljs.cp)('-R', (0, _path.join)(__dirname, '..', '..', '/templates/', projectType, '/', scriptType, '/typings.d.ts'), 'typings.d.ts');
    }
  }

  (0, _shelljs.cp)((0, _path.join)(__dirname, '..', '..', '..', '/config/template/index.template.html'), 'index.template.html');
  (0, _shelljs.cp)((0, _path.join)(__dirname, '..', '..', '..', `/config/template/${projectType}.smart.config.yml`), 'smart.config.yml');
  let {
    indexData,
    appData
  } = (0, _getAppTemplateData.getTemplateData)(projectType, scriptType);
  indexData = indexData.replace(/<pagesPath>/g, structure.pages || 'pages');
  appData = appData.replace(/<appPath>/g, structure.app || 'app');
  (0, _fs.writeFileSync)('index.js', indexData, 'utf-8');
  (0, _fs.writeFileSync)(pagesPath + '/app.' + fileSuffixName, appData, 'utf-8');
}