import chalk from 'chalk';
import { LogType } from 'types/LogType';

const log = console.log;
const info = chalk.bold.green;
const error = chalk.bold.red;
const warning = chalk.keyword('orange');

export function Log(...rest: any): void {
  log(info(typeof rest === 'object' ? JSON.stringify(rest) : rest));
}

export function LogWarn(text: string): void {
  log(warning(`Warning: ${text}`));
}

export function LogError(text: string): void {
  log(error(text));
}

export function getLogErrorStr(text: string): string {
  return error(text);
}

export function getLogInfoStr(text: string): string {
  return info(text);
}

/*const miles = 18;
const calculateFeet = miles => miles * 5280;*/
/*
log(chalk`
    There are {bold 5280 feet} in a mile.
    In {bold ${miles} miles}, there are {green.bold ${calculateFeet(miles)} feet}.
`);*/

export function PrintLog(logType: LogType, message = '', endMessage?: string): void {
  switch (logType) {
    case LogType.configFileLoadFailed:
      log(error(
        `Load Failed:
        smart config file load failed! please try again.
        detail: ${message}!`
      ));
      break;
    case LogType.cliNotExist:
      log(error(
        `Error: unknown command '${message}', to run 'smart --help'`)
      );
      break;
    case LogType.cliArgTypeError:
      log(error(
        `Command Arg Error: ${message} not a valid value.
         ${ endMessage? endMessage : 'to run \'smart --help\'' }`)
      );
      break;
    case LogType.projectNotExist:
      break;
    case LogType.projectExist:
      break;
  }
}
