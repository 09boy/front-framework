import { cd, cp, mkdir, touch } from 'shelljs';
import { SmartProjectOption } from 'types/Smart';
import getPackageData from './package';
import { readFileSync, writeFileSync } from 'fs';
import { getIgnoreData } from './ignore';
import { getJestConfigData } from './jestConfig';
import { getPrettierConfigData } from './getPrettierrc';
import { join } from 'path';
import { parseJsonFileToJsFile } from 'share/fsHelper';
import { getBrowserslistrcConfigData } from 'smart/tasks/create/browserslistrc';
import { getBabelResolveConfigData } from 'smart/tasks/init/babelResolveConfig';
import { SMART_ROOT_PATH } from 'share/path';

export default function intProject(option: SmartProjectOption, src = 'src'): void {
  const { projectType, scriptType, dirName } = option;
  mkdir(dirName);
  cd(dirName);

  const isTs = scriptType === 'ts';

  if (isTs) {
    touch('typings.d.ts');
  }

  cp(join(__dirname, '..', '..', `templates/smart-config/${projectType}.smart.config.yml`), 'smart.config.yml');

  // package
  const packageData = getPackageData(option, src);
  writeFileSync('package.json', JSON.stringify(packageData, null, 2));

  //.gitignore
  writeFileSync('.gitignore', getIgnoreData(projectType).join('\n'));

  // eslintrc
  cp('-f', join(__dirname, `../../templates/root/${projectType}.${scriptType}.eslint.js`), '.eslintrc.js');

  // babel
  const babelConfigData = readFileSync(join(__dirname, `../../templates/root/${projectType}.${scriptType}.babel.config.js`), 'utf-8');
  writeFileSync('babel.config.js', babelConfigData.replace(/<smart_path>/g, SMART_ROOT_PATH).replace('<rootPath>', src));

  // resolve
  writeFileSync(`${scriptType}config.json`, JSON.stringify(getBabelResolveConfigData(projectType, scriptType, src), null, 2));

  // jest
  writeFileSync('jest.config.json', JSON.stringify(getJestConfigData(projectType), null, 2));
  parseJsonFileToJsFile('jest.config');
  cp('-f', join(__dirname, `../../templates/root/${projectType}.${scriptType}.jest.setup.js`), '.jest.setup.js');

  // prettierrc
  writeFileSync('.prettierrc.json', JSON.stringify(getPrettierConfigData(projectType), null, 2));
  parseJsonFileToJsFile('.prettierrc');

  if (projectType !== 'miniProgram' && projectType !== 'nodejs') {
    cp(join(__dirname, '..', '..', 'templates/smart-config/index.template.html'), 'index.template.html');
    writeFileSync('.browserslistrc', getBrowserslistrcConfigData(projectType).join('\n'));
  }
}
