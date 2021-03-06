import { existsSync } from 'fs';
import { PROJECT_ROOT_PATH, SMART_ROOT_PATH } from 'share/path';
import { ProjectType, SmartStructureOption } from 'types/SmartProjectConfig';
import { SmartCliType, SmartCreateDirArg } from 'types/Smart';
import { createProjectCli, developProjectCli } from "share/env";

export function isSmartProject(): boolean {
  const hastPackageFile = existsSync('package.json');
  const hasSmartConfigFile = existsSync('smart.config.yml');
  return hastPackageFile && hasSmartConfigFile;
}

export function initSmart(): {
  isNewProject: boolean;
  smartCli: SmartCliType[];
} {
  const isNewProject = !isSmartProject();
  const smartCli: SmartCliType[] = isNewProject
      ? createProjectCli
      : developProjectCli;
  return {
    isNewProject,
    smartCli,
  };
}

export function isValidProjectName(name: string): boolean {
  return !existsSync(`${PROJECT_ROOT_PATH}/${name}`);
}

export function getProjectName(name: string): string {
  return name.trim().replace(/\s/g, '-').toLocaleLowerCase();
}

const FILE_Reg = /[.\-_ ']/g;

export function getComponentDirName(name: string): string {
  name = name.trim().toLocaleLowerCase().replace(FILE_Reg, '#');
  name = name.replace(/#/g, '-');
  return name;
}

export function getClassName(name: string): string {
  name = name.trim().toLocaleLowerCase().replace(FILE_Reg, '#');
  return name.split('#').map(s => s.replace(s.charAt(0), s.charAt(0).toUpperCase())).join('');
}

// for creating new pages or new components
export function getCreateNames(option: SmartCreateDirArg): string[] {
  let names: string[];
  if (typeof option === 'string') {
    names = option.split(',');
  } else if (Array.isArray(option)) {
    names = option;
  } else {
    names = Object.values(option);
  }
  names = names.filter(s => s.trim() !== '').map(s => s.trim());
  return [...new Set(names)];
}

export function getDynamicModule(name: string): string {
  return `${SMART_ROOT_PATH}/node_modules/${name.trim()}`;
}

export function getProjectStructure(projectType: ProjectType): SmartStructureOption {
  switch (projectType) {
    case 'normal':
      return {
        src: 'src',
        pages: 'pages',
        components: 'components',
        assets: {
          images: 'images',
          styles: 'styles'
        },
      };
    case 'react':
    case 'vue':
      return {
        src: 'src',
        pages: 'pages',
        components: 'components',
        assets: {
          images: 'images',
          styles: 'styles'
        },
        app: 'app',
      };
    case 'nodejs':
      return {
        src: 'src',
        pages: 'pages',
        assets: 'assets',
        routes: 'routes',
        server: 'server',
      };
    case 'miniProgram':
      return {
        src: 'src',
        pages: 'pages',
        components: 'components',
        assets: {
          images: 'images',
          styles: 'styles'
        },
      };
  }
}
