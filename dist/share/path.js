"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SMART_ROOT_PATH = exports.PROJECT_ROOT_PATH = void 0;

var _path = require("path");

const PROJECT_ROOT_PATH = process.cwd();
exports.PROJECT_ROOT_PATH = PROJECT_ROOT_PATH;
const SMART_ROOT_PATH = (0, _path.resolve)(__dirname, '..', '..');
exports.SMART_ROOT_PATH = SMART_ROOT_PATH;