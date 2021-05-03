"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseScriptTypeByCli = parseScriptTypeByCli;
exports.parsePortByCli = parsePortByCli;
exports.parseApiPathByCli = parseApiPathByCli;
exports.parseBuildEnv = parseBuildEnv;
exports.parseProjectTypeByCli = parseProjectTypeByCli;
exports.parseSmartCliByCli = parseSmartCliByCli;

var _commander = require("commander");

var _log = require("../share/log");

var _LogType = require("../types/LogType");

function parseScriptTypeByCli(type) {
  if (!type || type === 'js') {
    return 'js';
  }

  if (type === 'ts') {
    return 'ts';
  }

  throw new _commander.InvalidOptionArgumentError((0, _log.getLogErrorStr)('Not a valid value. expected value is js、ts'));
}

function parsePortByCli(port) {
  if (!port || isNaN(Number(port))) {
    throw new _commander.InvalidOptionArgumentError((0, _log.getLogErrorStr)('Not a valid value.'));
  }

  if (port.toString().length !== 4) {
    throw new _commander.InvalidOptionArgumentError((0, _log.getLogErrorStr)('Port must be 4 digits.'));
  }

  if (port.toString().startsWith('0')) {
    throw new _commander.InvalidOptionArgumentError((0, _log.getLogErrorStr)('Port Cannot start with 0.'));
  }

  return Number(port);
}

function parseApiPathByCli(path) {
  return path || '/';
}

function parseBuildEnv(mode, isThrowError = true) {
  if (mode === 'test' || mode === 'staging' || mode === 'release') {
    return mode;
  }

  if (isThrowError) {
    throw new _commander.InvalidOptionArgumentError((0, _log.getLogErrorStr)(`Arg Error: ${mode} not a valid value. you can input 'test' | 'staging' | 'release'`));
  }

  (0, _log.PrintLog)(_LogType.LogType.cliArgTypeError, mode, 'you can input one of \'test\' | \'staging\' | \'release\'');
  return undefined;
}

function parseProjectTypeByCli(type) {
  if (!type) {
    return 'normal';
  }

  if (type === 'normal' || type === 'react' || type === 'vue' || type === 'nodejs' || type === 'miniProgram') {
    return type;
  } // PrintLog(LogType.cliArgTypeError, type, 'you can input one of \'normal\' | \'react\' | \'vue\' | \'nodejs\' | \'miniProgram\'');


  throw new _commander.InvalidOptionArgumentError((0, _log.getLogErrorStr)('you can input one of \'normal\' | \'react\' | \'vue\' | \'nodejs\' | \'miniProgram\''));
}

function parseSmartCliByCli(command) {
  let cli;
  let projectType;

  if (command) {
    if (command.includes('-')) {
      const [_cli, _mode] = command.split('-');

      if (_mode) {
        projectType = _mode;
        cli = _cli;
      }
    } else {
      cli = command;

      if (cli === 'create') {
        projectType = 'normal';
      }
    }
  }

  if (!cli) {
    throw new _commander.InvalidOptionArgumentError((0, _log.getLogErrorStr)(`Arg Error: ${command} not a valid command. run 'smart --help'`));
  }

  return {
    cli,
    projectType
  };
}