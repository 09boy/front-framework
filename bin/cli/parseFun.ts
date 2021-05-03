import { ProjectType, ScriptType } from 'types/SmartProjectConfig';
import { InvalidOptionArgumentError } from 'commander';
import { getLogErrorStr, PrintLog } from 'share/log';
import { EnvModeType, SmartCliType } from 'types/Smart';
import { LogType } from 'types/LogType';

export function parseScriptTypeByCli(type: string | undefined): ScriptType {
  if (!type || type === 'js') {
    return 'js';
  }
  if (type === 'ts') {
    return 'ts';
  }

  throw new InvalidOptionArgumentError(getLogErrorStr('Not a valid value. expected value is js、ts'));
}

export function parsePortByCli(port?: string | number): number {
  if (!port || isNaN(Number(port))) {
    throw new InvalidOptionArgumentError(getLogErrorStr('Not a valid value.'));
  }

  if (port.toString().length !== 4) {
    throw new InvalidOptionArgumentError(getLogErrorStr('Port must be 4 digits.'));
  }

  if (port.toString().startsWith('0')) {
    throw new InvalidOptionArgumentError(getLogErrorStr('Port Cannot start with 0.'));
  }

  return Number(port);
}

export function parseApiPathByCli(path?: string): string {
  return path || '/';
}


export function parseBuildEnv(mode: string, isThrowError = true): EnvModeType | undefined {
  if (mode === 'test' || mode === 'staging' || mode === 'release') {
    return mode as EnvModeType;
  }

  if (isThrowError) {
    throw new InvalidOptionArgumentError(getLogErrorStr(`Arg Error: ${mode} not a valid value. you can input 'test' | 'staging' | 'release'`));
  }

  PrintLog(LogType.cliArgTypeError, mode, 'you can input one of \'test\' | \'staging\' | \'release\'');
  return undefined;
}

export function parseProjectTypeByCli(type?: string): ProjectType {
  if(!type) {
    return 'normal';
  }
  if (type === 'normal' || type === 'react' || type === 'vue' || type === 'nodejs' || type === 'miniProgram') {
    return type as ProjectType;
  }
  // PrintLog(LogType.cliArgTypeError, type, 'you can input one of \'normal\' | \'react\' | \'vue\' | \'nodejs\' | \'miniProgram\'');
  throw new InvalidOptionArgumentError(getLogErrorStr('you can input one of \'normal\' | \'react\' | \'vue\' | \'nodejs\' | \'miniProgram\''));
}

export function parseSmartCliByCli(command: string): {
  cli: SmartCliType;
  projectType?: ProjectType;
} {
  let cli: SmartCliType | undefined;
  let projectType: ProjectType | undefined;

  if (<SmartCliType>command) {
    if(command.includes('-')) {
      const [_cli, _mode] = command.split('-');
      if (<ProjectType>_mode) {
        projectType = _mode as ProjectType;
        cli = _cli as SmartCliType;
      }
    } else {
      cli = command as SmartCliType;
      if (cli === 'create') {
        projectType = 'normal';
      }
    }
  }

  if (!cli) {
    throw new InvalidOptionArgumentError(getLogErrorStr(`Arg Error: ${command} not a valid command. run 'smart --help'`));
  }

  return {
    cli,
    projectType,
  };
}
