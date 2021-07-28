"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = runProgressTask;

var _listr = require("listr2");

var _log = require("./log");

async function runProgressTask(tasks) {
  try {
    await new _listr.Listr(tasks).run();
  } catch (error) {
    (0, _log.LogError)(`LogProgress Error: ${error.message}`);
  }
}

module.exports = exports.default;