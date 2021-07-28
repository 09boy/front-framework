import { Listr, ListrTask } from 'listr2';
import { LogError } from './log';

export interface TaskContext {
  isCreateHtmlTemplate: boolean;
  isNeedUpdateSmart: boolean;
}

export default async function runProgressTask(tasks: ListrTask<TaskContext>[]): Promise<void> {
  try {
    await new Listr<TaskContext>(tasks).run();
  } catch (error) {
    LogError(`LogProgress Error: ${(error as TypeError).message}`);
  }
}