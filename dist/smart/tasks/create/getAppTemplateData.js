"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTemplateData = getTemplateData;

var _fs = require("fs");

var _path = require("path");

function getTemplateData(projectType, scriptType) {
  let indexData = '';
  let appData = '';

  if (projectType === 'normal') {
    console.log('');
  } else if (projectType === 'react') {
    indexData = (0, _fs.readFileSync)((0, _path.join)(__dirname, '..', '..', `templates/react/${scriptType}/index.${scriptType}`), 'utf-8');
    appData = (0, _fs.readFileSync)((0, _path.join)(__dirname, '..', '..', `templates/react/${scriptType}/app.${scriptType}x`), 'utf-8');
  }

  return {
    indexData,
    appData
  };
}