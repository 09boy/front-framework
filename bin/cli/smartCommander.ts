import { Command, OptionValues } from 'commander';
import { SMART_VERSION } from 'share/version';
import { PrintLog } from 'share/log';
import { SmartCommandsOption } from 'types/SmartCliConfig';
import { LogType } from 'types/LogType';
import { SmartCliArgs, SmartOption } from 'types/Smart';
import { parseApiPathByCli, parseBuildEnv, parsePortByCli, parseScriptTypeByCli, parseProjectTypeByCli, parseSmartCliByCli } from './parseFun';

function validationOptionParams(callback?: string): any {
  switch (callback) {
    case 'parsePort':
      return parsePortByCli;
    case 'parseApiPath':
      return parseApiPathByCli;
    case 'parseScriptType':
      return parseScriptTypeByCli;
    case 'parseProjectType':
      return parseProjectTypeByCli;
    default:
      return undefined;
  }
}

let commandValue: SmartOption;

function commandAction(commandArg: any, options?:OptionValues | Command , command?: Command) {
  const cliName = command?.name() || (options as Command)?.name();
  const { cli, projectType } = parseSmartCliByCli(cliName);
  const args: SmartCliArgs = { projectType };

  if (cli === 'build') {
    args.modeType = parseBuildEnv(commandArg, false);
  }

  if (options && !command) {
    Object.assign(args, commandArg);
  }

  if(options && command) {
    Object.assign(args, options);
    if (cli === 'init' || cli === 'create') {
      args.projectDir = commandArg as string;
    } else if (Array.isArray(commandArg)){
      if (cli === 'page') {
        args.pages = commandArg;
      } else if (cli === 'component') {
        args.components = commandArg;
      }
    }
  }

  commandValue = { cli, args };
}

export default async function smartCommand(data: SmartCommandsOption[]): Promise<SmartOption> {
  const program = new Command();
  program.version(SMART_VERSION)
         .name('smart')
         .on('command:*', (operands: any[]) => {
           if (operands[0]) {
             PrintLog(LogType.cliNotExist, operands[0]);
             process.exit(0);
           }
           process.exitCode = 1;
         });

  data.map(({ name,desc, options, alias }) => {
    const currentProgram = program.command(name)
      .alias(alias)
      .description(desc)
      .action(commandAction);

    if (Array.isArray(options)) {

      options.map(o => {
        currentProgram.option(o.name, o.desc, validationOptionParams(o.callback));
      });
    }
  });

  await program.parseAsync(process.argv);
  return commandValue;
}
