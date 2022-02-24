import util from 'util';
import { exec as _exec } from 'child_process';
import { resolve } from 'path';
import { mkdir } from 'fs/promises';
import { defaultDirStructure } from 'share/smartHelper';
import { ProjectType, ScriptType } from 'types/SmartType';

const exec = util.promisify(_exec);

async function mkDirs(structure: Record<string, string | string[]>, rootPath: string) {

  for (const key in structure) {
    if (Object.hasOwnProperty.call(structure, key)) {
      const value = structure[key];
      if (typeof value === 'string') {
        await mkdir(rootPath + '/' + value);
      } else {
        const  childRoot = value[0];
        for (const name of value) {
          await mkdir(rootPath + `/${name === childRoot  ? '' : childRoot  + '/'}` + name);
        }
      }
    }
  }
}

export async function createDirectoryStructure(path: string, type: ProjectType, sType: ScriptType): Promise<void> {
  const dirStructure = defaultDirStructure[type];
  const src = dirStructure.root as string;
  const rootPath = path + '/' + src;
  await mkdir(rootPath);

  const otherStructure = { ...dirStructure };
  delete otherStructure.root;
  await mkDirs(otherStructure, rootPath)

  const fileType = type === 'react' ? sType === 'js' ? 'jsx' : 'tsx' : sType;
  const indexPath = resolve(__dirname, '..', `templates/${type}/${sType}.index.${fileType}`);
  const appPath = resolve(__dirname, '..', `templates/${type}/${sType}.app.${fileType}`);
  const appStyle = resolve(__dirname, '..', `templates/${type}/style.css`);
  await exec(`cp ${indexPath} ${path}/index.${fileType}`);
  await exec(`cp ${appPath} ${rootPath}/app.${fileType}`);
  await exec(`cp ${appStyle} ${rootPath}/`);

  if (type === 'react') {
    const pagePath = typeof dirStructure.pages === 'string' ? dirStructure.pages : dirStructure.pages[0];
    const homePagePath = resolve(__dirname, '..', `templates/${type}/home/${sType}.index.${fileType}`);
    const aboutPagePath = resolve(__dirname, '..', `templates/${type}/about/${sType}.index.${fileType}`);
    await exec(`cp ${homePagePath} ${rootPath}/${pagePath}/home/index.${fileType}`);
    await exec(`cp ${aboutPagePath} ${rootPath}/${pagePath}/about/index.${fileType}`);
  }
}