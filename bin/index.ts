#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join } from 'path';
import jsYaml from 'js-yaml';
import { SmartOptionType } from 'types/SmartOptionType';
import { isSmartProject, parseCli } from 'share/projectHelper';
import { parseStructure } from 'share/tool';
import { PROJECT_ROOT_PATH } from 'share/path';
import { Log, LogError } from 'share/log';
import SmartCli, { SmartCliResultType } from 'cli';
import Smart from 'smart';

async function getSmartConfigureData(isInitApp: boolean, cliResult: SmartCliResultType): Promise<any> {
  const { cliName, args } = cliResult;
  if (cliName === 'upgrade' || !isInitApp && cliName === 'server') {
    return undefined;
  }

  const path = isInitApp ? `${PROJECT_ROOT_PATH}/smart.config.yml` : join(__dirname, `config/template/${cliName.split('-')[1] || args?.projectType || 'normal'}.smart.config.yml`);

  let packageData: any = {};
  if (['start', 'build', 'page', 'component'].includes(cliName)) {
    packageData = await import(`${PROJECT_ROOT_PATH}/package.json`);
  }

  try {
    const smartConfigData: any = await jsYaml.load(readFileSync(path, 'utf8'));
    return { ...smartConfigData, structure: parseStructure(smartConfigData.structure, cliName.split('-')[1] || packageData?.smart?.projectType) , ...packageData?.smart, name: packageData.name };
  } catch (e) {
    LogError(e);
  }
}

async function App() {
  const isInitApp = isSmartProject();
  const filterCli: string[] = isInitApp ?  ['create'] : ['start', 'build', 'page', 'component', 'page-child'];
  const cliResult = await SmartCli(filterCli);

  if (!cliResult) {
    return ;
  }

  const smartConfigData = await getSmartConfigureData(isInitApp, cliResult);
  const data: SmartOptionType = parseCli(cliResult, smartConfigData);
  console.log(cliResult);
  await Smart(data, { ...smartConfigData, ...data.cliArgs });
}

App().then(() => {});
