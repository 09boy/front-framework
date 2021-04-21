import { writeFileSync } from 'fs';
import { join } from 'path';
import { cp } from 'shelljs';
import { getProjectPaths } from 'share/tool';
import { CreateOptionType } from 'types/SmartConfigType';
import { getTemplateData } from './getAppTemplateData';


export async function initFiles({ projectType, structure, projectLanguageType }: CreateOptionType) {
  const { pagesPath, appPath, pages, app } = getProjectPaths(structure);
  const isTs = projectLanguageType === 'ts';
  let fileSuffixName: string = projectLanguageType;
  if (projectType === 'react') {
    fileSuffixName = fileSuffixName + 'x';

    await cp('-R', join(__dirname, '..', '..', '/templates/', projectType, '/', projectLanguageType, '/app/*'), appPath);
    await cp('-R', join(__dirname, '..', '..', '/templates/', projectType, '/', projectLanguageType, '/home'), pagesPath);
    await cp('-R', join(__dirname, '..', '..', '/templates/', projectType, '/', projectLanguageType, '/route.config.' + fileSuffixName), pagesPath);

    if (isTs) {
      await cp('-R', join(__dirname, '..', '..', '/templates/', projectType, '/', projectLanguageType, '/typings.d.ts'), 'typings.d.ts');
    }
  }

  await cp(join(__dirname, '..', '..', '..', '/config/template/index.template.html'), 'index.template.html');
  await cp(join(__dirname, '..', '..', '..', `/config/template/${projectType}.smart.config.yml`), 'smart.config.yml');

 let { indexData, appData } = await getTemplateData(projectType, projectLanguageType);
 indexData = indexData.replace(/<pagesPath>/g, pages || 'pages');
 appData = appData.replace(/<appPath>/g, app || 'app');

 await writeFileSync('index.js', indexData, 'utf-8');
 await writeFileSync(pagesPath + '/app.' + fileSuffixName, appData, 'utf-8');
}
