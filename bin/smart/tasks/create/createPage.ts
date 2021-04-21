import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { SmartConfigType } from 'types/SmartConfigType';
import { ProjectLanguageType } from 'types/ProjectType';
import { getClassName, getComponentDirName, getProjectPaths } from 'share/tool';
import { mkdir } from 'shelljs';


export default async function createPages(names: string[], {  structure, projectType, scriptingLanguageType }: SmartConfigType) {
  scriptingLanguageType = scriptingLanguageType || ProjectLanguageType.Javascript;
  const { pagesPath } = getProjectPaths(structure);

  const routConfigPath = pagesPath + '/route.config.' + scriptingLanguageType + 'x';

  const dirPaths = names.map(s => pagesPath + '/' + getComponentDirName(s));
  await mkdir('-p', dirPaths);

  const pageNames: {dirName: string; className: string;}[] = [];

  if (projectType === 'react') {
    for (let i = 0; i < dirPaths.length; i++ ) {
      const s = dirPaths[i];
      const dirName = s.split('/').pop() as string;
      const className = getClassName(names[i]);
      await parseReact(scriptingLanguageType, s, className);
      pageNames.push({dirName, className});
    }
  }
  console.log(pageNames, dirPaths);
  await updateRouteConfig(routConfigPath, pageNames);
}

async function parseReact(languageType: ProjectLanguageType, savePath: string, ClassName: string) {
  const indexFilePath = join(__dirname,  '..', '..', '/templates/react/', languageType, `/page/index.${languageType}x`);
  const styleFilepath = join(__dirname,  '..', '..', '/templates/react/', languageType, '/page/style.scss');

  let indexData = await readFileSync(indexFilePath, 'utf-8');
  indexData = indexData.replace(/<PageName>/g, ClassName);

  let styleData = await readFileSync(styleFilepath, 'utf-8');
  styleData = styleData.replace(/<PageName>/g, ClassName);

  await writeFileSync(savePath + '/index.' + languageType + 'x', indexData, 'utf-8');
  await writeFileSync(savePath + '/style.scss', styleData, 'utf-8');
}

async function updateRouteConfig(configPath: string, pageNames: Record<string, unknown>[]) {
  const routeConfigData = await readFileSync(configPath, 'utf-8');
  const [importsData, contentData] = routeConfigData.split('const');
  const newImports = importsData.trim() + '\n' + pageNames.map(o => `import ${o.className}Screen from 'pages/${o.dirName}';`).join('\n');
  await writeFileSync(configPath, newImports + '\n\n' + 'const' + contentData, 'utf-8');
}
