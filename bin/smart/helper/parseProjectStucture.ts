import { SmartStructureOption } from 'types/SmartProjectConfig';

/***
 * if value is null to use key
 * **/
export function parseProjectStructure(structure: SmartStructureOption) {
  const ps = parseData(structure);
  console.log(ps, structure.assets);
}

export function parseData(structure: Record<string, any>, parentPath = ''): string[] {
  parentPath = structure?.src as string || 'src';

  const paths: string[] = [parentPath];

  for (const key in structure) {
    if (key === 'src') {
      continue;
    }
    if (Object.hasOwnProperty.call(structure,key)) {
      const value: unknown = structure[key];
      if (typeof value === null || typeof value === 'undefined') {
        paths.push(parentPath + '/' + key);
      }

      if(typeof value === 'string') {
        paths.push(parentPath + '/' + value);
      }

      if (Array.isArray(value)) {
        const p = `${parentPath}/${key}`;
        paths.push(...value.map(s => `${p}/${s as string}`));
      }
    }
  }
  return paths;
}
