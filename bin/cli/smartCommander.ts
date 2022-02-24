import { Command, OptionValues } from 'commander';
import { SMART_VERSION } from 'share/version';
import { SmartCommandOption, SmartCommandResult, SmartResultOption } from 'types/SmartCliType';
import { parseApiPathByCli, parseBuildEnv, parsePortByCli, parseScriptTypeByCli, parseProjectTypeByCli, parseSmartCommand } from './parseFun';

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

let smartCommandResult: SmartCommandResult;

function commandAction(commandArg: any, options?:OptionValues | Command , command?: Command) {
  const cliName = command?.name() || (options as Command)?.name();
  const { commandName, projectType } = parseSmartCommand(cliName);
  const option: SmartResultOption = { projectType };

  if (commandName === 'build') {
    option.buildModeType = parseBuildEnv(commandArg, false);
  }

  if (options && !command) {
    Object.assign(option, commandArg);
  }

  if(options && command) {
    Object.assign(option, options);
    if (commandName === 'create') {
      option.projectName = commandArg as string;
    }/* else if (Array.isArray(commandArg)){
      if (commandName === 'page') {
        option.pages = commandArg;
      } else if (commandName === 'component') {
        option.components = commandArg;
      }
    }*/
  }

  smartCommandResult = { commandName, option };
}

export default async function smartCommand(data: SmartCommandOption[]): Promise<SmartCommandResult> {
  const program = new Command();
  program.version(SMART_VERSION)
         .name('smart')
         .on('command:*', (operands: any[]) => {
           if (operands[0]) {
             // PrintLog(LogType.cliNotExist, operands[0]);
             console.log(operands[0]);
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
  return smartCommandResult;
}
