import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { SmartCreatePage } from 'types/Smart';
import { mkdir } from 'shelljs';
import { ProjectType, ScriptType } from 'types/SmartProjectConfig';
import { PROJECT_ROOT_PATH } from 'share/path';
import { getClassName, getComponentDirName } from 'share/projectHelper';


export default function createPages(projectType: ProjectType, { names, scriptType, dirPath }: SmartCreatePage): void {
  const routConfigPath =  PROJECT_ROOT_PATH + '/' + dirPath + '/route.config.' + scriptType + 'x';
  const dirPaths = names.map(n => `${PROJECT_ROOT_PATH}/${dirPath}/${getComponentDirName(n)}`);
  mkdir('-p', dirPaths);

  // const pageNames: {dirName: string; className: string;}[] = [];
  dirPaths.map((n, i) => {
    const className = getClassName(names[i]);
    const pageDirName = n.split('/').pop() as string;
    if (projectType === 'react') {
      parseReact(scriptType, n, className);
      updateRouteConfig(routConfigPath, className, dirPath + '/' + pageDirName);
    }
  });
  console.log(dirPaths);
}

function parseReact(scriptType: ScriptType, savePath: string, ClassName: string) {
  const indexFilePath = join(__dirname,  '..', '..', '/templates/react/', scriptType, `/page/index.${scriptType}x`);
  const styleFilepath = join(__dirname,  '..', '..', '/templates/react/', scriptType, '/page/style.scss');

  let indexData = readFileSync(indexFilePath, 'utf-8');
  indexData = indexData.replace(/<PageName>/g, ClassName);

  let styleData = readFileSync(styleFilepath, 'utf-8');
  styleData = styleData.replace(/<PageName>/g, ClassName);

  writeFileSync(savePath + '/index.' + scriptType + 'x', indexData, 'utf-8');
  writeFileSync(savePath + '/style.scss', styleData, 'utf-8');
}

function updateRouteConfig(configPath: string, className: string, pagePath: string) {
  const routeConfigData = readFileSync(configPath, 'utf-8');
  const [importsData, contentData] = routeConfigData.split('const');
  const newImports = importsData.trim() + '\n' + `import ${className}Screen from '${pagePath}';` + '\n';
  writeFileSync(configPath, newImports + '\n\n' + 'const' + contentData, 'utf-8');
}
