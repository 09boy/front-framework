import { cd, mkdir, cp } from 'shelljs';
import { join } from 'path';
import { writeFileSync, readFileSync } from 'fs';
import { CreateOptionType, ProjectStructureType } from 'types/SmartConfigType';
import { parseJsonFileToJsFile } from 'share/fsHelper';
import { getPackageData } from './package';
import { getJestConfigData } from './jestConfig';
import { getIgnoreData } from './ignore';
import { getBabelResolveConfigData } from './babelResolveConfig';
import { getBrowserslistrcConfigData } from './browserslistrc';
import { SMART_ROOT_PATH } from 'share/path';

function parseData(obj: Object, parentPath: string): string[] {
  const paths: string[] = [];
  const keys: string[] = Object.keys(obj);

  Object.values(obj).map((s, i) => {
    let cp = `${parentPath}/${keys[i]}`;
    if (typeof s === 'object' && !Array.isArray(s)) {
      if (s.name) {
        cp = `${parentPath}/${s.name}`;
        delete s.name;
        paths.push(cp, ...parseData(s, cp));
      }
    } else if (Array.isArray(s)) {
      paths.push(cp, ...s.map( c => `${cp}/${c}`));
    } else if (s) {
      paths.push(`${parentPath}/${s}`);
    }
  });
  return paths;
}

function getProjectStructurePaths(structure: ProjectStructureType): string[] {
  const { src, assets } = structure;
  const paths: any = { ...structure };
  delete paths.src;
  return [src, '__tests__', ...parseData(paths, src), `${src}/${assets}/images`];
}

export async function createProjectStructure(projectName: string, structure: ProjectStructureType) {
  const paths = getProjectStructurePaths(structure);
  await mkdir(projectName);
  await cd(projectName);
  await mkdir(paths);
}

export async function createProjectConfigurationFiles({ structure, projectName, projectType, projectLanguageType }: CreateOptionType) {
  const { src, assets } = structure;
  const packageData = await getPackageData(projectName, projectType, projectLanguageType, src);
  await writeFileSync('package.json', JSON.stringify(packageData, null, 2));
  await writeFileSync('.gitignore', getIgnoreData(projectType, ['dist']).join('\n'));
  await writeFileSync('.browserslistrc', getBrowserslistrcConfigData(projectType).join('\n'));
  await writeFileSync(`${projectLanguageType}config.json`, JSON.stringify(getBabelResolveConfigData(projectType, projectLanguageType, src), null, 2));

  await cp('-f', join(__dirname, `../../templates/root/${projectType}.${projectLanguageType}.eslint.js`), '.eslintrc.js');
  // await cp('-f', join(__dirname, `../../templates/root/${projectType}.${projectLanguageType}.babel.config.js`), 'babel.config.js');
  const babelConfigData = await readFileSync(join(__dirname, `../../templates/root/${projectType}.${projectLanguageType}.babel.config.js`), 'utf-8');
  await writeFileSync('babel.config.js', babelConfigData.replace(/<smart_path>/g, SMART_ROOT_PATH).replace('<rootPath>', src));


  await writeFileSync('jest.config.json', JSON.stringify(getJestConfigData(projectType, src, projectLanguageType), null, 2));
  await parseJsonFileToJsFile('jest.config');

  const imagesPath = `${src}/${assets}/images/`;
  cp('-f', SMART_ROOT_PATH + '/smart.favicon.ico', imagesPath + 'favicon.ico');
  cp('-f', SMART_ROOT_PATH + '/smart.logo.png', imagesPath + 'smart.logo.png');
}
