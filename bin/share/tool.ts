import { SMART_ROOT_PATH } from 'share/path';
import { ProjectStructureType } from 'types/SmartConfigType';
import { ProjectType } from 'types/ProjectType';

export function getDynamicModule(name: string) {
  return `${SMART_ROOT_PATH}/node_modules/${name.trim()}`;
}

type structureOptionType = {
  src: string | undefined;
  pages: string | undefined;
  assets: string | undefined;
  components?: string;
  app?: string;
};
export function parseStructure({ src, pages, app, components, assets }: structureOptionType, projectType: ProjectType): ProjectStructureType {
  src = src || 'src';
  pages = pages || 'pages';
  assets = assets || 'assets';

  if (projectType === 'react' || projectType === 'vue') {
    app = app || 'app';
    components = components || 'components';
  }

  return {
    src,
    pages,
    assets,
    app,
    components,
  };
}

type PathsType = {
  src: string;
  pagesPath: string;
  assetsPath: string;
  componentsPath: string;
  appPath: string;
  pages?: string;
  app?: string;
};

export function getProjectPaths({ src, pages, assets, app, components }: ProjectStructureType): PathsType {
  const pagesPath = `${src}/${pages}`;
  const componentsPath = components ? `${src}/${components}` : '';
  const appPath = app ? `${src}/${app}` : '';
  const assetsPath = `${src}/${assets}`;

  return {
    src,
    pagesPath,
    componentsPath,
    appPath,
    assetsPath,
    pages,
    app,
  };
}

const FILE_Reg = /[.\-_' ']/g;

export function getComponentDirName(name: string): string {
  name = name.trim().toLocaleLowerCase().replace(FILE_Reg, '#');
  name = name.replace(/\#/g, '-');
  return name;
}

export function getClassName(name: string): string {
  name = name.trim().toLocaleLowerCase().replace(FILE_Reg, '#');
  const names = name.split('#').map(s => s.replace(s.charAt(0), s.charAt(0).toUpperCase())).join('');
  return names;
}
