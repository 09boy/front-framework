#!/usr/bin/env node

import { initSmart } from 'share/projectHelper';
import { getSmartConfigureData } from 'share/configHelper';
import SmartCli from 'cli';
import Smart from 'smart';

async function App(): Promise<void> {
  const { isNewProject, smartCli } = initSmart();
  const smartCommandValue = await SmartCli(smartCli);
  const smartTaskOption = await getSmartConfigureData(isNewProject, smartCommandValue);
  await Smart(smartTaskOption);
  console.log('smartTaskOption: =', smartTaskOption);
}

App().finally(() => {
  console.log('');
});
