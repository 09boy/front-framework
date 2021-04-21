import yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { CliType } from 'types/CliType';
import { CommandListType, smartCommand } from './smartCommander';
import { SmartInquirer, InquirerDataType } from './smartInquirer';

export type SmartCliResultType = {
  cliName: CliType;
  args?: {
    [key: string]: any;
  }
};

type DocType = {
  Commands: {
    [key: string]: CommandListType;
  }
};

function loadCliData() {
  try {
   return yaml.load(readFileSync(`${__dirname}/config.yml`, 'utf8'));
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

function parseData(doc: DocType, filtersCli: string[] = []): {
  commandOptions: CommandListType[];
  inquirerOptions: InquirerDataType;
} {
  const { Commands } = doc;
  const commandOptions: CommandListType[] = [];
  const inquirerOptions: InquirerDataType = [];

  for (const key in Commands) {
    if (filtersCli.includes(key)) {
      continue;
    }
    const config: any = Commands[key];
    const { children, interactive } = config;
    if (interactive) {
      !Array.isArray(interactive)
        ?
        inquirerOptions.push(interactive)
        :
        inquirerOptions.push(...interactive);
    }

    if (!children) {
      commandOptions.push(config);
    } else {
      commandOptions.push(...children);
    }
  }
  return {
    commandOptions,
    inquirerOptions,
  };
}

export default async function SmartCli(filtersCli?: string[]): Promise<SmartCliResultType | undefined> {
  const cliData = loadCliData();
  if (!cliData) {
    return;
  }
  const { commandOptions, inquirerOptions } = parseData(cliData as DocType, filtersCli);
  let result = await smartCommand(commandOptions);
  if (!result) {
    result = await SmartInquirer(inquirerOptions);
  }
  return result;
}
