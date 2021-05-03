"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _listr = require("listr2");

var _log = require("./log");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const ctx = {};

class LogProgressTask {
  constructor() {
    _defineProperty(this, "tasks", new _listr.Listr([], {
      ctx,
      concurrent: false
    }));
  }

  add(tasks) {
    tasks.map(t => {
      this.tasks.add(t);
    });
  }

  async run() {
    try {
      await this.tasks.run();
    } catch (error) {
      (0, _log.LogError)(`LogProgress Error: ${error.message}`);
    }
  }

}

exports.default = LogProgressTask;
module.exports = exports.default;