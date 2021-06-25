import { writeFileSync } from 'fs';
import { join } from 'path';
import { cp } from 'shelljs';
import { SmartProjectOption } from 'types/Smart';
import { SmartStructureOption } from 'types/SmartProjectConfig';
import { getTemplateData } from './getAppTemplateData';


export function initFiles({ projectType, scriptType }: SmartProjectOption, structure: SmartStructureOption): void {
  const { src, pages } = structure;
  const pagesPath = `${src}/${pages}`;
  let fileSuffixName: string = scriptType;

  if (projectType === 'react' || projectType === 'vue') {
    const appPath = `${src}/app`
    if (projectType === 'react') {
      fileSuffixName = fileSuffixName + 'x';
    }

    cp('-R', join(__dirname, '..', '..', '/templates/', projectType, '/', scriptType, '/app/*'), appPath);
    cp('-R', join(__dirname, '..', '..', '/templates/', projectType, '/', scriptType, '/home'), pagesPath);
    cp('-R', join(__dirname, '..', '..', '/templates/', projectType, '/', scriptType, '/route.config.' + fileSuffixName), pagesPath);
  }

  if (projectType === 'normal') {
    cp('-R', join(__dirname, '..', '..', '/templates/', projectType, 'common.scss'), `${src}/assets/styles`);
  }

  let { indexData, appData } = getTemplateData(projectType, scriptType);
  indexData = indexData.replace(/<pagesPath>/g, pages);
  appData = appData.replace(/<appPath>/g, 'app');

  writeFileSync(`index.${scriptType}`, indexData, 'utf-8');
  writeFileSync(pagesPath + '/app.' + fileSuffixName, appData, 'utf-8');
}
