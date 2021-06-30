import { mkdir, cp } from 'shelljs';
import { SMART_ROOT_PATH } from 'share/path';
import { ProjectType, SmartStructureOption } from 'types/SmartProjectConfig';

/*function parseData(obj: Record<string, any>, parentPath: string): string[] {
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
}*/

function parseData(structure: Record<string, any>, parentPath: string): string[] {
  const paths: string[] = [];
  for (const k in structure) {
    if (!Object.hasOwnProperty.call(structure, k)) {
      continue;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const value = structure[k];
    if (typeof value === 'string') {
      paths.push(`${parentPath}/${value}`);
    } else {
      paths.push(`${parentPath}/${k}`, ...parseData(value, `${parentPath}/${k}`));
    }
  }

  return paths;
}

export async function createProjectStructure(projectType: ProjectType, projectName: string, structure: SmartStructureOption): Promise<void> {
  const copyStructure: Record<string, any> = { ...structure };
  delete copyStructure.src;
  const paths: string[] = [structure.src, '__test__', ...parseData(copyStructure, structure.src)];

  await new Promise<void>(resolve => {
    mkdir(paths);
    const imagesPath = typeof structure.assets === 'string' ? `./${structure.src}/${structure.assets}/` : `./${structure.src}/assets/${structure.assets?.images ? structure.assets?.images : 'images'}/`;
    cp('-f', SMART_ROOT_PATH + '/smart.favicon.ico', imagesPath + 'favicon.ico');
    cp('-f', SMART_ROOT_PATH + '/smart.logo.png', imagesPath + 'smart.logo.png');

    resolve();
  });
}