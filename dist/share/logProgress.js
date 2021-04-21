"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _listr = require("listr2");

var _log = require("./log");

const ctx = {};

class LogProgressTask {
  tasks = new _listr.Listr([], {
    ctx,
    concurrent: false
  });

  async add(tasks) {
    tasks.map(t => {
      this.tasks.add(t);
    });
  }

  async run() {
    try {
      const cc = await this.tasks.run();
    } catch (e) {
      (0, _log.LogError)(`LogProgress Error: ${e}`);
    }
  }

}

exports.default = LogProgressTask;
module.exports = exports.default;