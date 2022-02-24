import  SmartCli from 'cli';
import { smartTaskRun } from 'smart/tasks';
import { isSmartProject } from 'share/smartHelper';
import { SmartCliCommandNameType } from 'types/SmartCliType';

export default async function smart(): Promise<void> {
  const isExistSmartProject = isSmartProject();
  const commandNames: SmartCliCommandNameType[] = isExistSmartProject ? ['start', 'test', 'server', 'build', 'upgrade'] : ['create', 'upgrade'];
  const commandResult = await SmartCli(commandNames);
  // console.log(commandResult);
  await smartTaskRun(commandResult);
}