import { cd, cp, mkdir, touch } from 'shelljs';
import { SmartProjectOption } from 'types/Smart';
import getPackageData from './package';
import { writeFileSync } from 'fs';
import { getIgnoreData } from './ignore';
import { getBabelResolveConfigData } from 'smart/tasks/init/babelResolveConfig';

export default function intProject(option: SmartProjectOption, src: string): void {
  const { projectType, modeType, scriptType, name, dirName } = option;
  mkdir(dirName);
  cd(dirName);

  const isTs = scriptType === 'ts';
  if (isTs) {
    touch('typings.d.ts');
  }

  // writeFileSync('.browserslistrc', getBrowserslistrcConfigData(projectType).join('\n'));

  // package
  const packageData = getPackageData(option, 'src');
  writeFileSync('package.json', JSON.stringify(packageData, null, 2));

  // writeFileSync(`${scriptType}.config.json`, JSON.stringify(getBabelResolveConfigData(projectType, scriptType, src), null, 2));
  // cp('-f', join(__dirname, `../../templates/root/${projectType}.${scriptType}.eslint.js`), '.eslintrc.js');
  /*
  *  const babelConfigData = readFileSync(join(__dirname, `../../templates/root/${projectType}.${scriptType}.babel.config.js`), 'utf-8');
  writeFileSync('babel.config.js', babelConfigData.replace(/<smart_path>/g, SMART_ROOT_PATH).replace('<rootPath>', src));
  * */

  /*
  * writeFileSync('jest.config.json', JSON.stringify(getJestConfigData(projectType), null, 2));
  parseJsonFileToJsFile('jest.config');
  * */

  /*
  *  const imagesPath = `${src}/${assets}/images/`;
  cp('-f', SMART_ROOT_PATH + '/smart.favicon.ico', imagesPath + 'favicon.ico');
  cp('-f', SMART_ROOT_PATH + '/smart.logo.png', imagesPath + 'smart.logo.png');
  * */

  //.gitignore
  writeFileSync('.gitignore', getIgnoreData(projectType).join('\n'));
}
