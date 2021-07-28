import { Listr, ListrTask, ListrContext } from 'listr2';
import { LogError } from './log';


interface Ctx extends ListrContext{
  /* some variables for internal use */
  k?: string;
}

const ctx: Ctx = {};

export default class LogProgressTask {
  private tasks: Listr  = new Listr<Ctx>([], { ctx, concurrent: false });

  add(tasks: ListrTask[]): void {
    tasks.map(t => {
      this.tasks.add(t);
    });
  }

  async run(): Promise<void> {
    try {
      await this.tasks.run();
    } catch (error: unknown) {
      LogError(`LogProgress Error: ${(error as TypeError).message}`);
    }
  }
}
