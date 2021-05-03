import { mkdir, test, touch } from 'shelljs';
import { join } from 'path';
import { writeFileSync, readFileSync } from 'fs';
import { ProjectType, ScriptType } from 'types/SmartProjectConfig';
import { getClassName, getComponentDirName } from 'share/projectHelper';
import { SmartCreatePage } from 'types/Smart';
import { PROJECT_ROOT_PATH } from 'share/path';

export default function createComponents(projectType: ProjectType, { names, scriptType, dirPath }: SmartCreatePage): void {
  // const { componentsPath } = getProjectPaths(structure);
  const indexFile = PROJECT_ROOT_PATH + '/' + dirPath + '/index.' + scriptType;

  if (!test('-f', indexFile)) {
    touch(indexFile);
  }

  const dirPaths = names.map(n => `${PROJECT_ROOT_PATH}/${dirPath}/${getComponentDirName(n)}`);
  mkdir('-p', dirPaths);

  const indexData = readFileSync(indexFile, 'utf-8');
  const indexDatas = indexData.split('\n').filter(s => !!s);

  dirPaths.map((n, i) => {
    const className = getClassName(names[i]);
    const pageDirName = n.split('/').pop() as string;
    indexDatas.push(`export * from './${pageDirName}';`);
    if (projectType === 'react') {
      parseReact(scriptType, pageDirName, className);
    }
  });

  writeFileSync(indexFile, indexDatas.join('\n').trim(), 'utf-8');
}

function parseReact(scriptType: ScriptType, savePath: string, ClassName: string) {
  const indexFilePath = join(__dirname,  '..', '..', '/templates/react/', scriptType, `/components/index.${scriptType}x`);
  const styleFilepath = join(__dirname,  '..', '..', '/templates/react/', scriptType, '/components/style.scss');

  let indexData = readFileSync(indexFilePath, 'utf-8');
  indexData = indexData.replace(/<ComponentName>/g, ClassName);

  let styleData = readFileSync(styleFilepath, 'utf-8');
  styleData = styleData.replace(/<ComponentName>/g, ClassName);

  writeFileSync(savePath + '/index.' + scriptType + 'x', indexData, 'utf-8');
  writeFileSync(savePath + '/style.scss', styleData, 'utf-8');
}
