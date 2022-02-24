"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseApiPathByCli = parseApiPathByCli;
exports.parseBuildEnv = parseBuildEnv;
exports.parsePortByCli = parsePortByCli;
exports.parseProjectTypeByCli = parseProjectTypeByCli;
exports.parseScriptTypeByCli = parseScriptTypeByCli;
exports.parseSmartCommand = parseSmartCommand;

var _commander = require("commander");

function parseScriptTypeByCli(type) {
  if (!type || type === 'js') {
    return 'js';
  }

  if (type === 'ts') {
    return 'ts';
  }

  throw new _commander.InvalidOptionArgumentError('Not a valid value. expected value is js、ts');
}

function parsePortByCli(port) {
  if (!port || isNaN(Number(port))) {
    throw new _commander.InvalidOptionArgumentError('Not a valid value.');
  }

  if (port.toString().length !== 4) {
    throw new _commander.InvalidOptionArgumentError('Port must be 4 digits.');
  }

  if (port.toString().startsWith('0')) {
    throw new _commander.InvalidOptionArgumentError('Port Cannot start with 0.');
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
    throw new _commander.InvalidOptionArgumentError(`Arg Error: ${mode} not a valid value. you can input 'test' | 'staging' | 'release'`);
  }

  console.warn(mode + ' you can input one of \'test\' | \'staging\' | \'release\'');
  return undefined;
}

function parseProjectTypeByCli(type) {
  if (!type) {
    return 'normal';
  }

  if (type === 'normal' || type === 'react' || type === 'vue' || type === 'nodejs' || type === 'miniProgram') {
    return type;
  } // PrintLog(LogType.cliArgTypeError, type, 'you can input one of \'normal\' | \'react\' | \'vue\' | \'nodejs\' | \'miniProgram\'');


  throw new _commander.InvalidOptionArgumentError('you can input one of \'normal\' | \'react\' | \'vue\' | \'nodejs\' | \'miniProgram\'');
}

function parseSmartCommand(command) {
  let commandName;
  let projectType;

  if (command) {
    if (command.includes('-')) {
      const [_cli, _mode] = command.split('-');

      if (_mode) {
        projectType = _mode;
        commandName = _cli;
      }
    } else {
      commandName = command;

      if (commandName === 'create') {
        projectType = 'normal';
      }
    }
  }

  if (!commandName) {
    throw new _commander.InvalidOptionArgumentError(`Arg Error: ${command} not a valid command. run 'smart --help'`);
  }

  return {
    commandName,
    projectType
  };
}