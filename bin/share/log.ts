import chalk from 'chalk';

const log = console.log;
const info = chalk.bold.green;
const error = chalk.bold.red;
const warning = chalk.keyword('orange');

export function Log(...rest: any) {
  log(info(typeof rest === 'object' ? JSON.stringify(rest) : rest));
}

export function LogWarn(text: string) {
  log(warning(`Warning: ${text}`));
}

export function LogError(text: string) {
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
