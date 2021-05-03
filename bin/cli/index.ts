import yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { PrintLog } from 'share/log';
import { LogType } from 'types/LogType';
import { SmartCliType, SmartOption } from 'types/Smart';
import { SmartCliConfig, SmartCommandsOption, SmartInquirerOption } from 'types/SmartCliConfig';
import smartCommand from './smartCommander';
import SmartInquirer from './smartInquirer';

export function loadCliData(): SmartCliConfig {
  try {
   return yaml.load(readFileSync(`${__dirname}/config.yml`, 'utf8')) as SmartCliConfig;
  } catch (e) {
    PrintLog(LogType.configFileLoadFailed, (e as TypeError).message);
    throw new Error((e as TypeError).message);
  }
}

export function parseCliDocData(doc: SmartCliConfig, includesCli: SmartCliType[]): {
  commandOptions: SmartCommandsOption[];
  inquirerOptions: SmartInquirerOption[];
} {
  const { Commands } = doc;
  const commandOptions: SmartCommandsOption[] = [];
  const inquirerOptions: SmartInquirerOption[] = [];

  for (const key in Commands) {
    if (Object.hasOwnProperty.call(Commands, key) && (key as SmartCliType) ) {
      if (!includesCli.includes(key as SmartCliType)) {
        continue;
      }

      const { interactive, children, alias, desc, name, options, callback } = Commands[key];
      if (Array.isArray(interactive)) {
        inquirerOptions.push(...interactive);
      } else {
        inquirerOptions.push(interactive);
      }

      if (children) {
        commandOptions.push(...children);
      } else {
        commandOptions.push({ name: name as string , alias: alias as string, desc: desc as string, options, callback });
      }
    }
  }
  return {
    commandOptions,
    inquirerOptions,
  };
}

export default async function SmartCli(includesCli: SmartCliType[] = []): Promise<SmartOption> {
  const configData = loadCliData();
  const { commandOptions, inquirerOptions } = parseCliDocData(configData, includesCli);

  if (process.argv.length <= 2) {
    return await SmartInquirer(inquirerOptions);
  }

  return await smartCommand(commandOptions);
}
