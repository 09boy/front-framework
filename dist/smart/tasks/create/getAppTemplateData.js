"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTemplateData = getTemplateData;

var _fs = require("fs");

var _path = require("path");

async function getTemplateData(projectType, projectLanguageType) {
  let indexData = '';
  let appData = '';

  if (projectType === 'normal') {} else if (projectType === 'react') {
    indexData = await (0, _fs.readFileSync)((0, _path.join)(__dirname, '..', '..', `templates/react/${projectLanguageType}/index.${projectLanguageType}`), 'utf-8');
    appData = await (0, _fs.readFileSync)((0, _path.join)(__dirname, '..', '..', `templates/react/${projectLanguageType}/app.${projectLanguageType}x`), 'utf-8');
  }

  return {
    indexData,
    appData
  };
}