// import inquirer, { ListQuestionOptions } from 'inquirer';
// import { getLogErrorStr } from 'share/log';
// import { isValidProjectName } from 'share/smartHelper';
// import { SmartInquirerOption } from 'types/SmartCliType';
// import { SmartCliArgs, SmartOption } from 'types/SmartType';
// import { parseSmartCliByCli, parsePortByCli } from './parseFun';
//
// function parsePages(value: string): boolean | string {
//   if (!value) {
//     return getLogErrorStr('Please enter the page name!');
//   }
//   return true;
// }
//
// function parseProjectName(value: string): boolean | string {
//   if (!value) {
//     return getLogErrorStr('Please enter the project name!');
//   }
//
//   if (!isValidProjectName(value.trim())) {
//     return getLogErrorStr(`The '${value.trim()}' project is already exist.`);
//   }
//   return true;
// }
//
// function parsePort(value: string): boolean | string {
//   parsePortByCli(value);
//   return true;
// }
//
//
// function applyValidate(option: SmartInquirerOption): SmartInquirerOption {
//   let validate;
//   switch (option.callback) {
//     case 'parsePort':
//       validate = parsePort;
//       break;
//     case 'parsePages':
//       validate = parsePages;
//       break;
//     case 'parseProjectName':
//       validate = parseProjectName;
//       break;
//     default:
//       break;
//   }
//   return { ...option, validate };
// }
//
// async function parseValues(cliName: string, cliArgs?: SmartCliArgs, option?: SmartInquirerOption): Promise<SmartOption> {
//   const { cli, projectType } = parseSmartCliByCli(cliName);
//   const args: SmartCliArgs = {  projectType, ...cliArgs };
//
//   if (option) {
//     const { children, name, key } = option;
//     const copyOption = applyValidate(option);
//
//     const values: any = await inquirer.prompt(copyOption);
//     if (key && typeof key === 'string') {
//       let keyValue = (values as Record<string, string | string[]>)[name];
//       if (Array.isArray(keyValue)) {
//         keyValue = keyValue[0];
//       }
//       if (key !== 'port' && keyValue.includes(',')) {
//         keyValue = keyValue.split(',');
//       }
//       Object.assign(args, { [key]: keyValue });
//     } else {
//       Object.assign(args, { ...values });
//     }
//     return parseValues(cliName, args, children as SmartInquirerOption);
//   }
//
//   return {
//     cli,
//     args,
//   };
// }
//
// const smartOption: ListQuestionOptions = {
//   name: 'name',
//   message: 'What do you want to do?',
//   type: 'list',
//   choices: [],
// };
//
// export default async function SmartInquirer(data: SmartInquirerOption[]): Promise<SmartOption> {
//   data = data.map(o => applyValidate(o));
//   smartOption.choices = data.map(({ name, value }) => ({ name: name, value: value }));
//   const { name: cliName } = await inquirer.prompt([smartOption]);
//   const option = data.filter(({ value, type }) => value === cliName && !!type)[0];
//   return parseValues(cliName, {}, option);
// }
"use strict";