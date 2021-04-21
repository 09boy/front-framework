"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.smartCommand = smartCommand;

var _commander = require("commander");

var _version = require("../share/version");

var _log = require("../share/log");

var _EnvType = require("../types/EnvType");

var _ProjectType = require("../types/ProjectType");

function parsePort(port) {
  if (isNaN(port)) {
    throw new _commander.InvalidOptionArgumentError((0, _log.getLogErrorStr)('Not a number.'));
  }

  if (port.toString().length !== 4) {
    throw new _commander.InvalidOptionArgumentError((0, _log.getLogErrorStr)('Port must be 4 digits.'));
  }

  return port;
}

function parseEnv(env) {
  if (!_EnvType.EnvNames.includes(env)) {
    (0, _log.LogError)(`
Error: Not a valid value.
The value is one of  'test'、 'staging'、'release.`);
    process.exit(1);
  }

  return env;
}

function parseApiPath(path) {
  return path || '/';
}

function parseLanguageType(type) {
  type = type.toLocaleLowerCase();

  if (type === _ProjectType.ProjectLanguageType.Typescript || type === _ProjectType.ProjectLanguageType.Javascript || type === _ProjectType.ProjectLanguageType.Javascript1 || type === _ProjectType.ProjectLanguageType.Typescript1) {
    return type;
  }

  throw new _commander.InvalidOptionArgumentError((0, _log.getLogErrorStr)('Aot a valid value, js、javascript、ts、typescript'));
}

function validationOptionParams(callback) {
  if (callback === 'parsePort') {
    return parsePort;
  } else if (callback === 'parseEnv') {
    return parseEnv;
  }

  switch (callback) {
    case 'parsePort':
      return parsePort;

    case 'parseApiPath':
      return parseApiPath;

    case 'parseLanguageType':
      return parseLanguageType;

    default:
      return undefined;
  }
}

let resultValue;

async function commandAction(args, option, command) {
  let options = option;
  let argValues = args;
  const name = (command === null || command === void 0 ? void 0 : command.name()) || (option === null || option === void 0 ? void 0 : option.name());

  if (name === 'build') {
    args = parseEnv(args);
    argValues = {
      env: args
    };
  }

  if (!command) {
    // 如果一个命令没有参数也没有options
    options = args;
    argValues = undefined;
  }

  if (typeof argValues === 'string') {
    const key = name.includes('create') ? 'projectName' : argValues;
    argValues = {
      [key]: argValues
    };
  }

  resultValue = {
    cliName: name,
    args: { ...argValues,
      ...options
    }
  };
}

async function smartCommand(data) {
  if (process.argv.length <= 2) {
    return undefined;
  }

  const program = new _commander.Command();
  program.version(_version.SMART_VERSION).name('smart').on('command:*', operands => {
    if (operands[0]) {
      (0, _log.LogError)(`Error: unknown command '${operands[0]}'. See 'smart --help'.`);
    }

    resultValue = undefined;
    process.exitCode = 1;
  });
  data.map(({
    name,
    desc,
    options,
    alias
  }) => {
    const currentProgram = program.command(name).alias(alias).description(desc).action(commandAction);

    if (options) {
      options.map(o => {
        currentProgram.option(o.name, o.desc, validationOptionParams(o.callback));
      });
    }
  });
  await program.parseAsync(process.argv);
  return resultValue;
}