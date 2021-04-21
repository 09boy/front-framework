"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Log = Log;
exports.LogWarn = LogWarn;
exports.LogError = LogError;
exports.getLogErrorStr = getLogErrorStr;
exports.getLogInfoStr = getLogInfoStr;

var _chalk = _interopRequireDefault(require("chalk"));

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