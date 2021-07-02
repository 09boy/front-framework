import { mkdir, cp } from 'shelljs';
import { SMART_ROOT_PATH } from 'share/path';
import { ProjectType, SmartStructureOption } from 'types/SmartProjectConfig';

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