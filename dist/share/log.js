"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Log = Log;
exports.LogWarn = LogWarn;
exports.LogError = LogError;
exports.getLogErrorStr = getLogErrorStr;
exports.getLogInfoStr = getLogInfoStr;
exports.PrintLog = PrintLog;

var _chalk = _interopRequireDefault(require("chalk"));

var _LogType = require("../types/LogType");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const log = console.log;
const info = _chalk.default.bold.green;
const error = _chalk.default.bold.red;

const warning = _chalk.default.keyword('orange');

function Log(...rest) {
  log(info(typeof rest === 'object' ? JSON.stringify(rest) : rest));
}

function LogWarn(text) {
  log(warning(`Warning: ${text}`));
}

function LogError(text) {
  log(error(text));
}

function getLogErrorStr(text) {
  return error(text);
}

function getLogInfoStr(text) {
  return info(text);
}
/*const miles = 18;
const calculateFeet = miles => miles * 5280;*/

/*
log(chalk`
    There are {bold 5280 feet} in a mile.
    In {bold ${miles} miles}, there are {green.bold ${calculateFeet(miles)} feet}.
`);*/


function PrintLog(logType, message = '', endMessage) {
  switch (logType) {
    case _LogType.LogType.configFileLoadFailed:
      log(error(`Load Failed:
        smart config file load failed! please try again.
        detail: ${message}!`));
      break;

    case _LogType.LogType.cliNotExist:
      log(error(`Error: unknown command '${message}', to run 'smart --help'`));
      break;

    case _LogType.LogType.cliArgTypeError:
      log(error(`Command Arg Error: ${message} not a valid value.
         ${endMessage ? endMessage : 'to run \'smart --help\''}`));
      break;

    case _LogType.LogType.projectNotExist:
      break;

    case _LogType.LogType.projectExist:
      break;
  }
}