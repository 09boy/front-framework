"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SmartCli;
exports.loadCliData = loadCliData;
exports.parseCliDocData = parseCliDocData;

var _jsYaml = _interopRequireDefault(require("js-yaml"));

var _fs = require("fs");

var _log = require("../share/log");

var _LogType = require("../types/LogType");

var _smartCommander = _interopRequireDefault(require("./smartCommander"));

var _smartInquirer = _interopRequireDefault(require("./smartInquirer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadCliData() {
  try {
    return _jsYaml.default.load((0, _fs.readFileSync)(`${__dirname}/config.yml`, 'utf8'));
  } catch (e) {
    (0, _log.PrintLog)(_LogType.LogType.configFileLoadFailed, e.message);
    throw new Error(e.message);
  }
}

function parseCliDocData(doc, includesCli) {
  const {
    Commands
  } = doc;
  const commandOptions = [];
  const inquirerOptions = [];

  for (const key in Commands) {
    if (Object.hasOwnProperty.call(Commands, key) && key) {
      if (!includesCli.includes(key)) {
        continue;
      }

      const {
        interactive,
        children,
        alias,
        desc,
        name,
        options,
        callback
      } = Commands[key];

      if (Array.isArray(interactive)) {
        inquirerOptions.push(...interactive);
      } else {
        inquirerOptions.push(interactive);
      }

      if (children) {
        commandOptions.push(...children);
      } else {
        commandOptions.push({
          name: name,
          alias: alias,
          desc: desc,
          options,
          callback
        });
      }
    }
  }

  return {
    commandOptions,
    inquirerOptions
  };
}

async function SmartCli(includesCli = []) {
  const configData = loadCliData();
  const {
    commandOptions,
    inquirerOptions
  } = parseCliDocData(configData, includesCli);

  if (process.argv.length <= 2) {
    return await (0, _smartInquirer.default)(inquirerOptions);
  }

  return await (0, _smartCommander.default)(commandOptions);
}