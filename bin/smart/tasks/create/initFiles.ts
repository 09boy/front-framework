import { writeFileSync } from 'fs';
import { join } from 'path';
import { cp } from 'shelljs';
import { getProjectStructurePath } from 'share/projectHelper';
import { SmartProjectOption } from 'types/Smart';
import { SmartStructureOption } from 'types/SmartProjectConfig';
import { getTemplateData } from './getAppTemplateData';


export function initFiles({ projectType, scriptType }: SmartProjectOption, structure: SmartStructureOption): void {
  const { pagesPath, appPath } = getProjectStructurePath(structure);
  const isTs = scriptType === 'ts';
  let fileSuffixName: string = scriptType;
  if (projectType === 'react') {
    fileSuffixName = fileSuffixName + 'x';

    cp('-R', join(__dirname, '..', '..', '/templates/', projectType, '/', scriptType, '/app/*'), appPath);
    cp('-R', join(__dirname, '..', '..', '/templates/', projectType, '/', scriptType, '/home'), pagesPath);
    cp('-R', join(__dirname, '..', '..', '/templates/', projectType, '/', scriptType, '/route.config.' + fileSuffixName), pagesPath);

    if (isTs) {
      cp('-R', join(__dirname, '..', '..', '/templates/', projectType, '/', scriptType, '/typings.d.ts'), 'typings.d.ts');
    }
  }

  cp(join(__dirname, '..', '..', '..', '/config/template/index.template.html'), 'index.template.html');
  cp(join(__dirname, '..', '..', '..', `/config/template/${projectType}.smart.config.yml`), 'smart.config.yml');

 let { indexData, appData } = getTemplateData(projectType, scriptType);
 indexData = indexData.replace(/<pagesPath>/g, structure.pages || 'pages');
 appData = appData.replace(/<appPath>/g, structure.app || 'app');

 writeFileSync('index.js', indexData, 'utf-8');
 writeFileSync(pagesPath + '/app.' + fileSuffixName, appData, 'utf-8');
}
