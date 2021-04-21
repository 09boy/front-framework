"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initFiles = initFiles;

var _fs = require("fs");

var _path = require("path");

var _shelljs = require("shelljs");

var _tool = require("../../../share/tool");

var _getAppTemplateData = require("./getAppTemplateData");

async function initFiles({
  projectType,
  structure,
  projectLanguageType
}) {
  const {
    pagesPath,
    appPath,
    pages,
    app
  } = (0, _tool.getProjectPaths)(structure);
  const isTs = projectLanguageType === 'ts';
  let fileSuffixName = projectLanguageType;

  if (projectType === 'react') {
    fileSuffixName = fileSuffixName + 'x';
    await (0, _shelljs.cp)('-R', (0, _path.join)(__dirname, '..', '..', '/templates/', projectType, '/', projectLanguageType, '/app/*'), appPath);
    await (0, _shelljs.cp)('-R', (0, _path.join)(__dirname, '..', '..', '/templates/', projectType, '/', projectLanguageType, '/home'), pagesPath);
    await (0, _shelljs.cp)('-R', (0, _path.join)(__dirname, '..', '..', '/templates/', projectType, '/', projectLanguageType, '/route.config.' + fileSuffixName), pagesPath);

    if (isTs) {
      await (0, _shelljs.cp)('-R', (0, _path.join)(__dirname, '..', '..', '/templates/', projectType, '/', projectLanguageType, '/typings.d.ts'), 'typings.d.ts');
    }
  }

  await (0, _shelljs.cp)((0, _path.join)(__dirname, '..', '..', '..', '/config/template/index.template.html'), 'index.template.html');
  await (0, _shelljs.cp)((0, _path.join)(__dirname, '..', '..', '..', `/config/template/${projectType}.smart.config.yml`), 'smart.config.yml');
  let {
    indexData,
    appData
  } = await (0, _getAppTemplateData.getTemplateData)(projectType, projectLanguageType);
  indexData = indexData.replace(/<pagesPath>/g, pages || 'pages');
  appData = appData.replace(/<appPath>/g, app || 'app');
  await (0, _fs.writeFileSync)('index.js', indexData, 'utf-8');
  await (0, _fs.writeFileSync)(pagesPath + '/app.' + fileSuffixName, appData, 'utf-8');
}