import yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { SmartCliConfigData,
  SmartCliCommandNameType,
  SmartCommandOption,
  SmartInquirerOption,
  SmartCommandResult } from 'types/SmartCliType';
import smartCommand from './smartCommander';
// import SmartInquirer from './smartInquirer';
//
export function loadCliData(): SmartCliConfigData {
  try {
    const data = yaml.load(readFileSync(`${__dirname}/config.yml`, 'utf8')) as {[key: string] : any};
    return data.Commands as SmartCliConfigData;
  } catch (e) {
    throw new Error((e as TypeError).message);
  }
}

export function parseCliDocData(Commands: SmartCliConfigData, includesCli: SmartCliCommandNameType[]): {
  commandsData: SmartCommandOption[];
  inquirersData: SmartInquirerOption[];
} {
  const commandsData: SmartCommandOption[] = [];
  const inquirersData: SmartInquirerOption[] = [];

  for (const key in Commands) {
    if (Object.hasOwnProperty.call(Commands, key) && (key as SmartCliCommandNameType) ) {
      if (!includesCli.includes(key as SmartCliCommandNameType)) {
        continue;
      }

      const { interactive, children, alias, desc, name, options, callback } = Commands[key];
      if (Array.isArray(interactive)) {
        inquirersData.push(...interactive);
      } else if(interactive) {
        inquirersData.push(interactive);
      }

      if (children) {
        commandsData.push(...children);
      } else {
        commandsData.push({ name , alias, desc, options, callback });
      }
    }
  }
  return {
    commandsData,
    inquirersData,
  };
}

export default async function SmartCli(commandNames: SmartCliCommandNameType[] = []): Promise<SmartCommandResult> {
  const configData = loadCliData();
  const { commandsData, inquirersData } = parseCliDocData(configData, commandNames);
  // console.log(commandsData, commandNames)
  // if (process.argv.length <= 2) {
  //   return await SmartInquirer(inquirerOptions);
  // }
  //
  return await smartCommand(commandsData);
}
