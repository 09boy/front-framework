"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SmartCli;
exports.loadCliData = loadCliData;
exports.parseCliDocData = parseCliDocData;

var _jsYaml = _interopRequireDefault(require("js-yaml"));

var _fs = require("fs");

var _smartCommander = _interopRequireDefault(require("./smartCommander"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import SmartInquirer from './smartInquirer';
//
function loadCliData() {
  try {
    const data = _jsYaml.default.load((0, _fs.readFileSync)(`${__dirname}/config.yml`, 'utf8'));

    return data.Commands;
  } catch (e) {
    throw new Error(e.message);
  }
}

function parseCliDocData(Commands, includesCli) {
  const commandsData = [];
  const inquirersData = [];

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
        inquirersData.push(...interactive);
      } else if (interactive) {
        inquirersData.push(interactive);
      }

      if (children) {
        commandsData.push(...children);
      } else {
        commandsData.push({
          name,
          alias,
          desc,
          options,
          callback
        });
      }
    }
  }

  return {
    commandsData,
    inquirersData
  };
}

async function SmartCli(commandNames = []) {
  const configData = loadCliData();
  const {
    commandsData,
    inquirersData
  } = parseCliDocData(configData, commandNames); // console.log(commandsData, commandNames)
  // if (process.argv.length <= 2) {
  //   return await SmartInquirer(inquirerOptions);
  // }
  //

  return await (0, _smartCommander.default)(commandsData);
}