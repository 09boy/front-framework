import { mkdir, test, touch } from 'shelljs';
import { join } from 'path';
import { writeFileSync, readFileSync } from 'fs';
import { SmartConfigType } from 'types/SmartConfigType';
import { getProjectPaths, getClassName, getComponentDirName } from 'share/tool';
import { ProjectLanguageType } from 'types/ProjectType';

export default async function createComponents(names: string[], {  structure, projectType, scriptingLanguageType }: SmartConfigType) {
  scriptingLanguageType = scriptingLanguageType || ProjectLanguageType.Javascript;

  const { componentsPath } = getProjectPaths(structure);
  const indexFile = componentsPath + '/index.' + scriptingLanguageType;

  if (!test('-f', indexFile)) {
    await touch(indexFile);
  }

  const dirPaths = names.map(s => componentsPath + '/' + getComponentDirName(s));
  await mkdir('-p', dirPaths);

  const dirNames: string[] = [];

  if (projectType === 'react') {
    for (let i = 0; i < dirPaths.length; i++ ) {
      const s = dirPaths[i];
      const dirName = s.split('/').pop() as string;
      await parseReact(scriptingLanguageType, s,  getClassName(names[i]));
      dirNames.push(dirName);
    }
  }

  const indexData = await readFileSync(indexFile, 'utf-8');
  const indexDatas = indexData.split('\n').filter(s => !!s);

  dirNames.map(dirName => {
    indexDatas.push(`export * from './${dirName}';`);
  });

  await writeFileSync(indexFile, indexDatas.join('\n').trim(), 'utf-8');
}

async function parseReact(languageType: ProjectLanguageType, savePath: string, ClassName: string) {
  const indexFilePath = join(__dirname,  '..', '..', '/templates/react/', languageType, `/components/index.${languageType}x`);
  const styleFilepath = join(__dirname,  '..', '..', '/templates/react/', languageType, '/components/style.scss');

  let indexData = await readFileSync(indexFilePath, 'utf-8');
  indexData = indexData.replace(/<ComponentName>/g, ClassName);

  let styleData = await readFileSync(styleFilepath, 'utf-8');
  styleData = styleData.replace(/<ComponentName>/g, ClassName);

  await writeFileSync(savePath + '/index.' + languageType + 'x', indexData, 'utf-8');
  await writeFileSync(savePath + '/style.scss', styleData, 'utf-8');
}
