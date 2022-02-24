"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = smart;

var _cli = _interopRequireDefault(require("../cli"));

var _tasks = require("./tasks");

var _smartHelper = require("../share/smartHelper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function smart() {
  const isExistSmartProject = (0, _smartHelper.isSmartProject)();
  const commandNames = isExistSmartProject ? ['start', 'test', 'server', 'build', 'upgrade'] : ['create', 'upgrade'];
  const commandResult = await (0, _cli.default)(commandNames); // console.log(commandResult);

  await (0, _tasks.smartTaskRun)(commandResult);
}

module.exports = exports.default;