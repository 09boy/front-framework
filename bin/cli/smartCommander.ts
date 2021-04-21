import { Command, OptionValues, InvalidOptionArgumentError }  from 'commander';
import { SMART_VERSION } from 'share/version';
import { getLogErrorStr, LogError } from 'share/log';
import { EnvNames } from 'types/EnvType';
import { SmartCliResultType } from './index';
import { ProjectLanguageType } from 'types/ProjectType';

export type CommandListType= {
  name: string;
  alias: string;
  desc: string;
  options?: CommandOptionType[];
  children?: CommandListType[];
};

export type CommandOptionType = {
  name: string;
  desc: string;
  callback?: string;
};

function parsePort(port: any): number {
  if (isNaN(port)) {
    throw new InvalidOptionArgumentError(getLogErrorStr('Not a number.'));
  }

  if (port.toString().length !== 4) {
    throw new InvalidOptionArgumentError(getLogErrorStr('Port must be 4 digits.'));
  }

  return port;
}

function parseEnv(env: any): string {
  if (!EnvNames.includes(env)) {
LogError(`
Error: Not a valid value.
The value is one of  'test'、 'staging'、'release.`);
    process.exit(1);
  }
  return env;
}

function parseApiPath(path: any): string {
  return path || '/';
}

function parseLanguageType(type: any): string {
  type = type.toLocaleLowerCase();
  if (type === ProjectLanguageType.Typescript || type === ProjectLanguageType.Javascript ||
      type === ProjectLanguageType.Javascript1 || type === ProjectLanguageType.Typescript1) {
    return type;
  }
  throw new InvalidOptionArgumentError(getLogErrorStr('Aot a valid value, js、javascript、ts、typescript'));
}

function validationOptionParams(callback?: string): any {
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

let resultValue: SmartCliResultType | undefined;

async function commandAction(args?: string | string[], option?: OptionValues | Command, command?: Command) {
  let options = option;
  let argValues: any = args;
  const name = command?.name() || option?.name();

  if (name === 'build') {
    args = parseEnv(args);
    argValues = { env: args };
  }

  if (!command) { // 如果一个命令没有参数也没有options
    options = args as OptionValues;
    argValues = undefined;
  }

  if (typeof argValues === 'string') {
    const key = name.includes('create') ? 'projectName' : argValues;
    argValues = { [key]: argValues };
  }

  resultValue = {
    cliName: name,
    args: {
      ...argValues,
      ...options,
    },
  };
}

export async function smartCommand(data: CommandListType[]): Promise<SmartCliResultType | undefined> {
  if (process.argv.length <= 2) {
    return undefined;
  }
  const program = new Command();
  program.version(SMART_VERSION)
         .name('smart')
         .on('command:*', (operands) => {
           if (operands[0]) {
             LogError(`Error: unknown command '${operands[0]}'. See 'smart --help'.`);
           }
           resultValue = undefined;
           process.exitCode = 1;
         });

  data.map(({ name,desc, options, alias }) => {
    const currentProgram = program.command(name)
      .alias(alias)
      .description(desc)
      .action(commandAction);

    if (options) {
      options.map(o => {
        currentProgram.option(o.name, o.desc, validationOptionParams(o.callback));
      });
    }
  });

  await program.parseAsync(process.argv);
  return resultValue;
}
