"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = intProject;

var _shelljs = require("shelljs");

function intProject({
  projectType,
  modeType,
  scriptType,
  name,
  dirName
}) {
  (0, _shelljs.mkdir)(dirName);
  (0, _shelljs.cd)(dirName);
}

module.exports = exports.default;