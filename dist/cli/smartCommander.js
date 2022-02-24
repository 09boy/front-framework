"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = smartCommand;

var _commander = require("commander");

var _version = require("../share/version");

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

let smartCommandResult;

function commandAction(commandArg, options, command) {
  const cliName = command?.name() || options?.name();
  const {
    commandName,
    projectType
  } = (0, _parseFun.parseSmartCommand)(cliName);
  const option = {
    projectType
  };

  if (commandName === 'build') {
    option.buildModeType = (0, _parseFun.parseBuildEnv)(commandArg, false);
  }

  if (options && !command) {
    Object.assign(option, commandArg);
  }

  if (options && command) {
    Object.assign(option, options);

    if (commandName === 'create') {
      option.projectName = commandArg;
    }
    /* else if (Array.isArray(commandArg)){
     if (commandName === 'page') {
       option.pages = commandArg;
     } else if (commandName === 'component') {
       option.components = commandArg;
     }
    }*/

  }

  smartCommandResult = {
    commandName,
    option
  };
}

async function smartCommand(data) {
  const program = new _commander.Command();
  program.version(_version.SMART_VERSION).name('smart').on('command:*', operands => {
    if (operands[0]) {
      // PrintLog(LogType.cliNotExist, operands[0]);
      console.log(operands[0]);
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
  return smartCommandResult;
}

module.exports = exports.default;