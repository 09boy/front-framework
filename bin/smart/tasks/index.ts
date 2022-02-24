import { PROJECT_ROOT_PATH } from 'share/path';
import { SmartCommandResult } from 'types/SmartCliType';
import { Listr, ListrTask } from 'listr2';
import { ProjectType } from 'types/SmartType';
import { createProjectTask } from './project';
import { startDevServe, startServer } from './server';
import { build, upgrade } from './actions';


async function parseCommandResult({ commandName, option }: SmartCommandResult): Promise<ListrTask[]>  {
  switch (commandName) {
    case 'create':
    {
      const { projectType = 'normal', projectName = '', scriptType = 'js' } = option || {};
      const reg = /[?*.(\s+]/g;
      const name = reg.test(projectName) ? projectName.replace(reg, '-') : projectName;
      return createProjectTask(name, projectType as ProjectType, scriptType);
    }
    case 'start':
    {
      process.env.__MODE__ = 'start';
      process.env.NODE_ENV = 'development';
      await startDevServe(option);
    }
      break;
    case 'build':
    {
      process.env.__MODE__ = option ? option.buildModeType || 'test' : 'start';
      process.env.NODE_ENV = 'production';
      await build();
    }
      break;
    case 'server':
      startServer(3003, PROJECT_ROOT_PATH + '/dist');
      break;
    case 'upgrade':
      upgrade();
      break;
  }

  return [];
}

export interface Ctx {
  dependencies?: string[];
  devDependencies?: string[];
}

const ctx: Ctx = {
  dependencies: undefined,
  devDependencies: undefined,
}

export async function smartTaskRun(result: SmartCommandResult): Promise<void> {
  const taskList = await parseCommandResult(result);

  if (result.commandName === 'create') {
    const tasks = new Listr<Ctx>(taskList, { exitOnError: true, concurrent: false, ctx });
    try {
      await tasks.run();
    } catch (e) {
      console.log(e, '=== custom');
    }
  }
}