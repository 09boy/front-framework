import { ProjectType, ScriptType } from 'types/SmartType';
import { InvalidOptionArgumentError } from 'commander';
import { EnvModeType } from 'types/SmartType';
import { SmartCliCommandNameType } from 'types/SmartCliType';

export function parseScriptTypeByCli(type: string | undefined): ScriptType {
  if (!type || type === 'js') {
    return 'js';
  }
  if (type === 'ts') {
    return 'ts';
  }

  throw new InvalidOptionArgumentError('Not a valid value. expected value is js、ts');
}

export function parsePortByCli(port?: string | number): number {
  if (!port || isNaN(Number(port))) {
    throw new InvalidOptionArgumentError('Not a valid value.');
  }

  if (port.toString().length !== 4) {
    throw new InvalidOptionArgumentError('Port must be 4 digits.');
  }

  if (port.toString().startsWith('0')) {
    throw new InvalidOptionArgumentError('Port Cannot start with 0.');
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
    throw new InvalidOptionArgumentError(`Arg Error: ${mode} not a valid value. you can input 'test' | 'staging' | 'release'`);
  }

  console.warn(mode + ' you can input one of \'test\' | \'staging\' | \'release\'');
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
  throw new InvalidOptionArgumentError('you can input one of \'normal\' | \'react\' | \'vue\' | \'nodejs\' | \'miniProgram\'');
}

export function parseSmartCommand(command: string): {
  commandName: SmartCliCommandNameType;
  projectType?: ProjectType;
} {
  let commandName: SmartCliCommandNameType | undefined;
  let projectType: ProjectType | undefined;

  if (<SmartCliCommandNameType>command) {
    if(command.includes('-')) {
      const [_cli, _mode] = command.split('-');
      if (<ProjectType>_mode) {
        projectType = _mode as ProjectType;
        commandName = _cli as SmartCliCommandNameType;
      }
    } else {
      commandName = command as SmartCliCommandNameType;
      if (commandName === 'create') {
        projectType = 'normal';
      }
    }
  }

  if (!commandName) {
    throw new InvalidOptionArgumentError(`Arg Error: ${command} not a valid command. run 'smart --help'`);
  }

  return {
    commandName,
    projectType,
  };
}
