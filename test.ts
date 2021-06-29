// import { Listr, ListrTask } from 'listr2';
const {  Listr } = require('listr2');


async function delay(ms = 5000) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
}

async function main () {
  try {
    await new Listr(
      [
        {
          title: 'Geting you on-board.',
          task: async (ctx, task) =>
            ctx.user = await task.prompt({
              type: 'Toggle',
              message: 'Do you want to create beautiful CLI interfaces?',
              initial: true
            })
        },

        {
          title: 'Doing initial configuration',
          skip: (ctx) => !ctx.user,
          task: (_, task) =>
            task.newListr(
              [
                {
                  title: 'Spinning up a new project...',
                  task: async (_, task) => {
                    await delay(2000)
                    task.output = 'Created a new project.'
                  }
                },

                {
                  title: 'Install Listr2...',
                  task: async (_, task)=> {
                    task.output = 'Installing Listr2...'
                    await delay(2000)
                    task.output = 'Listr2 installed.'
                  }
                },

                {
                  title: 'Follow through the README and the examples.',
                  task: async (_, task) => {
                    task.output = 'Going through the README'
                    task.output = 'Create a new Listr'
                    await delay(500)
                    task.output = 'The Concept of Context'
                    await delay(500)
                    task.output = 'Subtasks'
                    await delay(500)
                    task.output = 'Get User Input'
                    await delay(500)
                    task.output = 'Enable a Task'
                    await delay(500)
                    task.output = 'Skip a Task'
                    await delay(500)
                    task.output = 'Show Output'
                    await delay(500)
                    task.output = 'Throw Errors'
                    await delay(500)
                    task.output = 'Task Manager'
                    await delay(500)
                  },
                  options: {
                    bottomBar: 3
                  }
                }
              ],
              { concurrent: true, rendererOptions: { collapse: false } }
            )
        },

        {
          title: 'Utilizing a intuative way to create task lists!',
          enabled: (ctx) => ctx.user,
          task: (_, task) =>
            task.newListr(
              [
                {
                  title: 'Showing some output',
                  task: async () => {
                    await delay(2000)
                  }
                },

                {
                  title: 'Enabling events depending on context',
                  task: async () => {
                    await delay(1000)
                  }
                },

                {
                  title: 'Throwing some errors',
                  task: async (_, task) => {
                    await delay(2500)
                    task.skip('No errors at all!')
                  }
                }
              ],
              { concurrent: true, rendererOptions: { collapse: false } }
            )
        },

        {
          title: 'Writing some code!',
          enabled: (ctx) => ctx.user,
          task: (_, task) =>
            task.newListr(
              [
                {
                  title: 'More code',
                  task: async () => {
                    await delay(2000)
                  }
                },

                {
                  title: 'Oh no the types!',
                  task: async () => {
                    await delay(1000)
                  }
                },

                {
                  title: 'Some tests are needed too!',
                  task: async () => {
                    await delay(2500)
                  }
                },

                {
                  title: 'CI/CD configuration is a must',
                  task: async () => {
                    await delay(2500)
                  }
                }
              ],
              { concurrent: false, rendererOptions: { collapse: true } }
            )
        },

        {
          title: 'Pulling some hair out.',
          task: (_, task) =>
            task.newListr(
              [
                {
                  title: 'Lots of bugs to fix',
                  task: async () => {
                    await delay(1000)
                    throw new Error('Can not find the bugs :/')
                  }
                },

                {
                  title: 'Some type errors',
                  task: async () => {
                    await delay(1000)
                    throw new Error('This type can not be assigned to type with, oh noes')
                  }
                },

                {
                  title: 'Getting some help from Google.',
                  task: async (_, task) => {
                    await delay(500)
                    task.title = 'I have found the answers to the universe!'
                  }
                }
              ],
              {
                concurrent: true,
                exitOnError: false
              }
            )
        },

        {
          title: 'In the end it will all be worth it!',
          task: async (_, task) => {
            await delay(1000)
            task.title = 'Created a beautiful CLI interface!'
          }
        }
      ],
      {}
    ).run()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}

// main()
const t= new Listr([
  {
    title: 'Geting you on-board.',
    task: (ctx, task) => {
     setTimeout(()=> {}, 3000)
    }

  },
  {
    title: 'In the end it will all be worth it!',
    task: async (_, task) => {
      await delay(1000)
      task.title = 'Created a beautiful CLI interface!'
    }
  }
], {});
t.run();