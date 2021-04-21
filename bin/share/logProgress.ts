import { Listr, ListrTask } from 'listr2';
import { LogError } from './log';


interface Ctx {
  /* some variables for internal use */
}

const ctx: Ctx = {
};

export default class LogProgressTask {
  private tasks: Listr  = new Listr<Ctx>([], { ctx, concurrent: false });

  async add(tasks: ListrTask[]) {
    tasks.map(t => {
      this.tasks.add(t);
    });
  }

  async run() {
    try {
      const cc = await this.tasks.run();
    } catch (e) {
      LogError(`LogProgress Error: ${e}`);
    }
  }
}
