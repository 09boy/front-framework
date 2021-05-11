import { cd, cp, mkdir, touch } from 'shelljs';
import { SmartProjectOption } from 'types/Smart';
import getPackageData from './package';
import { writeFileSync } from "fs";
import { getIgnoreData } from './ignore';
import { getJestConfigData } from './jestConfig';
import { getPrettierConfigData } from './getPrettierrc';
import { join } from 'path';
import { parseJsonFileToJsFile } from 'share/fsHelper';

export default function intProject(option: SmartProjectOption): void {
  const { projectType, scriptType, dirName } = option;
  mkdir(dirName);
  cd(dirName);

  if (projectType !== 'miniProgram') {
    cp(join(__dirname, '..', '..', 'templates/smart-config/index.template.html'), 'index.template.html');
  }
  cp(join(__dirname, '..', '..', `templates/smart-config/${projectType}.smart.config.yml`), 'smart.config.yml');

  const isTs = scriptType === 'ts';
  if (isTs) {
    touch('typings.d.ts');
  }
  // package
  const packageData = getPackageData(option, 'src');
  writeFileSync('package.json', JSON.stringify(packageData, null, 2));
  cp('-f', join(__dirname, `../../templates/root/${projectType}.${scriptType}.eslint.js`), '.eslintrc.js');

  writeFileSync('.prettierrc.json', JSON.stringify(getPrettierConfigData(projectType), null, 2));
  parseJsonFileToJsFile('.prettierrc');
  writeFileSync('jest.config.json', JSON.stringify(getJestConfigData(projectType), null, 2));
  parseJsonFileToJsFile('jest.config');
  cp('-f', join(__dirname, `../../templates/root/${projectType}.${scriptType}.jest.setup.js`), '.jest.setup.js');

  //.gitignore
  writeFileSync('.gitignore', getIgnoreData(projectType).join('\n'));
}
