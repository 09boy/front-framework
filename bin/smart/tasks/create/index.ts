import { cd, mkdir, cp } from 'shelljs';
import { join } from 'path';
import { writeFileSync, readFileSync } from 'fs';
import { parseJsonFileToJsFile } from 'share/fsHelper';
import { getJestConfigData } from '../init/jestConfig';
import { getBabelResolveConfigData } from '../init/babelResolveConfig';
import { getBrowserslistrcConfigData } from './browserslistrc';
import { SMART_ROOT_PATH } from 'share/path';
import { ProjectType, SmartConfigOption, SmartStructureOption } from 'types/SmartProjectConfig';
import { SmartProjectOption } from 'types/Smart';

function parseData(obj: Record<string, any>, parentPath: string): string[] {
  const paths: string[] = [];
  const keys: string[] = Object.keys(obj);

  Object.values(obj).map((s, i) => {
    let cp = `${parentPath}/${keys[i]}`;
    if (typeof s === 'object' && !Array.isArray(s)) {
      if (Object.hasOwnProperty.call(s, 'name')) {
        cp = `${parentPath}/${(s as Record<string, any>).name as string}`;
        delete (s as Record<string, any>).name;
        paths.push(cp, ...parseData(s, cp));
      }
    } else if (Array.isArray(s)) {
      paths.push(cp, ...s.map( c => `${cp}/${c as string}`));
    } else if (typeof s === 'string') {
      paths.push(`${parentPath}/${s}`);
    }
  });
  return paths;
}

export function createProjectStructure(projectType: ProjectType, projectName: string, structure: SmartStructureOption): void {
  const copyStructure: Record<string, any> = { ...structure };
  delete copyStructure.src;
  const paths: string[] = [structure.src, '__test__', ...parseData(copyStructure, structure.src), `${structure.src}/${structure.assets}/images`];

  mkdir(projectName);
  cd(projectName);
  mkdir(paths);
}

export function createProjectConfigurationFiles( projectOption :SmartProjectOption, { structure }: SmartConfigOption): void {
  const { projectType, scriptType } = projectOption;
  const { src, assets } = structure;

  writeFileSync('.browserslistrc', getBrowserslistrcConfigData(projectType).join('\n'));
  writeFileSync(`${scriptType}config.json`, JSON.stringify(getBabelResolveConfigData(projectType, scriptType, src), null, 2));

  cp('-f', join(__dirname, `../../templates/root/${projectType}.${scriptType}.eslint.js`), '.eslintrc.js');
  // await cp('-f', join(__dirname, `../../templates/root/${projectType}.${projectLanguageType}.babel.config.js`), 'babel.config.js');
  const babelConfigData = readFileSync(join(__dirname, `../../templates/root/${projectType}.${scriptType}.babel.config.js`), 'utf-8');
  writeFileSync('babel.config.js', babelConfigData.replace(/<smart_path>/g, SMART_ROOT_PATH).replace('<rootPath>', src));


  writeFileSync('jest.config.json', JSON.stringify(getJestConfigData(projectType), null, 2));
  parseJsonFileToJsFile('jest.config');

  const imagesPath = `${src}/${assets}/images/`;
  cp('-f', SMART_ROOT_PATH + '/smart.favicon.ico', imagesPath + 'favicon.ico');
  cp('-f', SMART_ROOT_PATH + '/smart.logo.png', imagesPath + 'smart.logo.png');
}
