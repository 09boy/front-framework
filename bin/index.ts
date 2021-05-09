#!/usr/bin/env node

import {isSmartProject} from 'share/projectHelper';
import {getSmartConfigureData} from 'share/configHelper';
import {developProjectCli, createProjectCli} from 'share/env';
import {SmartCliType} from 'types/Smart';
import SmartCli from 'cli';
import Smart from 'smart';

async function App(): Promise<void> {
  const isSTProject = isSmartProject();
  const smartCli: SmartCliType[] = isSTProject
    ? developProjectCli
    : createProjectCli;
  const smartCommandValue = await SmartCli(smartCli);
  const smartTaskValue = await getSmartConfigureData(
    isSTProject,
    smartCommandValue,
  );
  smartTaskValue && (await Smart(smartTaskValue));
}

App().finally(() => {
  console.log('');
});
