"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SmartCli;

var _jsYaml = _interopRequireDefault(require("js-yaml"));

var _fs = require("fs");

var _smartCommander = require("./smartCommander");

var _smartInquirer = require("./smartInquirer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadCliData() {
  try {
    return _jsYaml.default.load((0, _fs.readFileSync)(`${__dirname}/config.yml`, 'utf8'));
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

function parseData(doc, filtersCli = []) {
  const {
    Commands
  } = doc;
  const commandOptions = [];
  const inquirerOptions = [];

  for (const key in Commands) {
    if (filtersCli.includes(key)) {
      continue;
    }

    const config = Commands[key];
    const {
      children,
      interactive
    } = config;

    if (interactive) {
      !Array.isArray(interactive) ? inquirerOptions.push(interactive) : inquirerOptions.push(...interactive);
    }

    if (!children) {
      commandOptions.push(config);
    } else {
      commandOptions.push(...children);
    }
  }

  return {
    commandOptions,
    inquirerOptions
  };
}

async function SmartCli(filtersCli) {
  const cliData = loadCliData();

  if (!cliData) {
    return;
  }

  const {
    commandOptions,
    inquirerOptions
  } = parseData(cliData, filtersCli);
  let result = await (0, _smartCommander.smartCommand)(commandOptions);

  if (!result) {
    result = await (0, _smartInquirer.SmartInquirer)(inquirerOptions);
  }

  return result;
}

module.exports = exports.default;