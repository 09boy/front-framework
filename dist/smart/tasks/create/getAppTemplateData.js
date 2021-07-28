"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTemplateData = getTemplateData;

var _fs = require("fs");

var _path = require("path");

function getTemplateData(projectType, scriptType) {
  const suffixName = projectType === 'react' ? `${scriptType}x` : `${scriptType}`;
  const indexData = (0, _fs.readFileSync)((0, _path.join)(__dirname, '..', '..', `templates/${projectType}/${scriptType}/index.${scriptType}`), 'utf-8');
  const appData = (0, _fs.readFileSync)((0, _path.join)(__dirname, '..', '..', `templates/${projectType}/${scriptType}/app.${suffixName}`), 'utf-8');
  return {
    indexData,
    appData
  };
}