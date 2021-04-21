import { existsSync } from 'fs';
import { PROJECT_ROOT_PATH } from 'share/path';
import { SmartCliResultType } from 'cli';
import { ProjectLanguageType, ProjectType } from 'types/ProjectType';
import { CreateOptionType } from 'types/SmartConfigType';
import { SmartOptionType } from 'types/SmartOptionType';
import { CliType } from 'types/CliType';

export function isSmartProject(): boolean {
  const hastPackageFile = existsSync('package.json');
  const hasSmartConfigFile = existsSync('smart.config.yml');
  return hastPackageFile && hasSmartConfigFile;
}

export function isValidProjectName(name: string): boolean {
  return !existsSync(`${PROJECT_ROOT_PATH}/${name}`);
}

export function getProjectName(name: string): string {
  return name.trim().replace(/\s/g, '-');
}

function getScriptingLanguageType(type: string | string[] | undefined): ProjectLanguageType {
  if (typeof type === 'string') {
    return type === ProjectLanguageType.Typescript || type === ProjectLanguageType.Typescript1 ? ProjectLanguageType.Typescript : ProjectLanguageType.Javascript;
  } else if (Array.isArray(type)) {
    return type.includes('ts') ? ProjectLanguageType.Typescript : ProjectLanguageType.Javascript;
  }
  return ProjectLanguageType.Javascript;
}

function parseDirNames(args: any): string[] {
  let names: string[] = [];
  if (typeof args === 'object') {
    if (args.hasOwnProperty('names') && typeof args.names === 'string') {
      names = args.names.split(',');
    } else {
      names = Object.values(args);
    }
  }
  names = names.filter(s => s.trim() !== '');
  return [...new Set(names)];
}

export function parseCli(data: SmartCliResultType, smartConfig?: any): SmartOptionType {
  const { cliName, args } = data;
  const cliArr =  cliName.split('-');
  const cliType: CliType = cliArr[0] as CliType;
  const projectType: string = cliArr[1] || smartConfig?.projectType || 'normal';
  const port = args?.port || smartConfig?.port;
  const host = args?.host || smartConfig?.host;
  const htmlPath = args?.htmlPath || `${smartConfig?.buildDir}/index.html`;

  const result: SmartOptionType = { cliType };

  switch (cliType) {
    case 'start':
    case 'server':
      result.cliArgs = { port, host, htmlPath: `${PROJECT_ROOT_PATH}/${htmlPath}` };
      break;
    case 'page':
      result.cliArgs = { pages: parseDirNames(args) };
      break;
    case 'component':
      result.cliArgs = { components: parseDirNames(args) };
      break;
    case 'build':
      result.cliArgs = args;
      break;
    case 'upgrade':
      break;
    case 'create':
    default:
      const createOption: CreateOptionType = {
        projectType: projectType as ProjectType,
        projectName: getProjectName(args?.projectName.trim()),
        projectLanguageType: getScriptingLanguageType(args?.languageType),
        structure: smartConfig.structure,
      };
      result.cliArgs = { createOption };
      break;
  }
  return result;
}
