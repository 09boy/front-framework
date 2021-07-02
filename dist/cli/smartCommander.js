"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = smartCommand;

var _commander = require("commander");

var _version = require("../share/version");

var _log = require("../share/log");

var _LogType = require("../types/LogType");

var _parseFun = require("./parseFun");

function validationOptionParams(callback) {
  switch (callback) {
    case 'parsePort':
      return _parseFun.parsePortByCli;

    case 'parseApiPath':
      return _parseFun.parseApiPathByCli;

    case 'parseScriptType':
      return _parseFun.parseScriptTypeByCli;

    case 'parseProjectType':
      return _parseFun.parseProjectTypeByCli;

    default:
      return undefined;
  }
}

let commandValue;

function commandAction(commandArg, options, command) {
  const cliName = (command === null || command === void 0 ? void 0 : command.name()) || (options === null || options === void 0 ? void 0 : options.name());
  const {
    cli,
    projectType
  } = (0, _parseFun.parseSmartCliByCli)(cliName);
  const args = {
    projectType
  };

  if (cli === 'build') {
    args.modeType = (0, _parseFun.parseBuildEnv)(commandArg, false);
  }

  if (options && !command) {
    Object.assign(args, commandArg);
  }

  if (options && command) {
    Object.assign(args, options);

    if (cli === 'create') {
      args.projectDir = commandArg;
    } else if (Array.isArray(commandArg)) {
      if (cli === 'page') {
        args.pages = commandArg;
      } else if (cli === 'component') {
        args.components = commandArg;
      }
    }
  }

  commandValue = {
    cli,
    args
  };
}

async function smartCommand(data) {
  const program = new _commander.Command();
  program.version(_version.SMART_VERSION).name('smart').on('command:*', operands => {
    if (operands[0]) {
      (0, _log.PrintLog)(_LogType.LogType.cliNotExist, operands[0]);
      process.exit(0);
    }

    process.exitCode = 1;
  });
  data.map(({
    name,
    desc,
    options,
    alias
  }) => {
    const currentProgram = program.command(name).alias(alias).description(desc).action(commandAction);

    if (Array.isArray(options)) {
      options.map(o => {
        currentProgram.option(o.name, o.desc, validationOptionParams(o.callback));
      });
    }
  });
  await program.parseAsync(process.argv);
  return commandValue;
}

module.exports = exports.default;