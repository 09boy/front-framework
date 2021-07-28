import { cd, cp, mkdir, touch } from 'shelljs';
import { SmartProjectOption } from 'types/Smart';
import getPackageData from './package';
import { promises } from 'fs';
import { getIgnoreData } from './ignore';
import { getJestConfigData } from './jestConfig';
import { getPrettierConfigData } from './getPrettierrc';
import { join } from 'path';
import { parseJsonFileToJsFile } from 'share/fsHelper';
import { getBrowserslistrcConfigData } from 'smart/tasks/create/browserslistrc';
import { getBabelResolveConfigData } from 'smart/tasks/init/babelResolveConfig';
import { SMART_ROOT_PATH } from 'share/path';
import { ListrTask } from "listr2";
import { TaskContext } from "share/logProgress";

export default function initProjectTasks(option: SmartProjectOption, src: string, buildDir: string): ListrTask<TaskContext>[] {
  const { projectType, scriptType, dirName } = option;
  const isTs = scriptType === 'ts';
  const isCreateHtmlTemplate = projectType !== 'miniProgram' && projectType !== 'nodejs';

  return [
    {
      title: `Create ${dirName} directory.`,
      task: async (): Promise<void> => {
       await new Promise<void>(resolve => {
         mkdir(dirName);
         cd(dirName);
         if (isTs) {
           touch('typings.d.ts');
         }
         resolve();
       });
      },
    },
    {
      title: 'Write the smart.config.yml file.',
      task: async (): Promise<void> => {
        await new Promise<void>(resolve => {
          cp(join(__dirname, '..', '..', `templates/smart-config/${projectType}.smart.config.yml`), 'smart.config.yml');
          resolve();
        })
      },
    },
    {
      title: 'Create the package.json file.',
      task: async (): Promise<void> => {
        const packageData = await getPackageData(option, src, buildDir);
        await promises.writeFile('package.json', JSON.stringify(packageData, null, 2));
      },
    },
    {
      title: 'Create the eslint files.',
      task: async (): Promise<void> => {
        await promises.writeFile('.gitignore', getIgnoreData(projectType).join('\n'));
        await new Promise<void>(resolve => {
          cp('-f', join(__dirname, `../../templates/root/${projectType}.${scriptType}.eslint.js`), '.eslintrc.js');
          resolve();
        });
      },
    },
    /*{
      title: 'Create the prettier file.',
      task: async (): Promise<void> => {
        await promises.writeFile('.prettierrc.json', JSON.stringify(getPrettierConfigData(projectType), null, 2));
        await parseJsonFileToJsFile('prettier.config');
      },
    },*/
    {
      title: 'Create the babel files.',
      task: async (): Promise<void> => {
        await promises.writeFile(`${scriptType}config.json`, JSON.stringify(getBabelResolveConfigData(projectType, scriptType, src), null, 2));

        const babelConfigData = await promises.readFile(join(__dirname, `../../templates/root/${projectType}.${scriptType}.babel.config.js`), 'utf-8');
        await promises.writeFile('babel.config.js', babelConfigData.replace(/<smart_path>/g, SMART_ROOT_PATH).replace('<rootPath>', src));
      },
    },
    {
      // title: 'Create the html.template file.',
      skip: (): boolean => !isCreateHtmlTemplate,
      task: async (ctx, task): Promise<void> => {
        task.title = 'Create the html.template file.';
        cp(join(__dirname, '..', '..', 'templates/smart-config/index.template.html'), 'index.template.html');
        await promises.writeFile('.browserslistrc', getBrowserslistrcConfigData().join('\n'));
      },
    },
    {
      title: 'Create the jest files.',
      task: async (): Promise<void> => {
        // cp('-f', join(__dirname, `../../templates/root/${projectType}.${scriptType}.jest.setup.js`), '.jest.setup.js');
        await promises.writeFile('jest.config.json', JSON.stringify(getJestConfigData(projectType), null, 2));
        await parseJsonFileToJsFile('jest.config');
      },
    },
  ];
}