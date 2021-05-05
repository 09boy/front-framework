import jsYaml from 'js-yaml';
import { join } from 'path';
import { readFileSync } from 'fs';
import { PrintLog } from 'share/log';
import { PROJECT_ROOT_PATH } from 'share/path';
import { SmartOption,
  SmartTaskOption,
  SmartCreatePage,
  SmartServerOptionType,
  SmartProjectOption, SmartServerParamsType } from 'types/Smart';
import { LogType } from 'types/LogType';
import { ProjectType, ScriptType, SmartConfigOption, PackageData } from 'types/SmartProjectConfig';
import { getCreateNames, getProjectStructurePath } from 'share/projectHelper';


export async function getSmartConfigureData(isSTProject: boolean, option: SmartOption): Promise<SmartTaskOption> {
  const { cli, args: { projectType, port, host, htmlPath }  } = option;
  if (cli === 'upgrade') {
    return { cli };
  }

  if (!isSTProject && cli === 'server') {
    return getServerTaskOption({ port, host, htmlPath });
  }

  try {
    const packageData: PackageData | undefined = cli !== 'server' ? await import(`${PROJECT_ROOT_PATH}/package.json`) as PackageData : undefined;
    const path = isSTProject ? `${PROJECT_ROOT_PATH}/smart.config.yml` : join(__dirname, '..', `config/template/${projectType || 'normal'}.smart.config.yml`);
    const smartConfigData =  jsYaml.load(readFileSync(path, 'utf8')) as SmartConfigOption;
    if (cli === 'server') {
      return getServerTaskOption({ port, host, htmlPath: htmlPath || smartConfigData.buildDir });
    }
    return parseSmartOption(option, smartConfigData, packageData);
  } catch (e) {
    PrintLog(LogType.configFileLoadFailed, (e as TypeError).message);
  }

  return {
    cli,
  };
}

export function parseSmartOption(option: SmartOption, defaultData: SmartConfigOption, packageData?: PackageData): SmartTaskOption {
  const { cli, args: { port, host, projectType, components, pages, projectDir, modeType, scriptType, htmlPath } } = option;
  const { structure, buildDir } = defaultData;
  // if structure value is null to use key
  const copyStructure: Record<string, string | null | undefined> = { ...structure };
  for (const key in copyStructure) {
    if (Object.hasOwnProperty.call(copyStructure, key)) {
      const value = copyStructure[key];
      if (!value) {
        Object.assign(structure, { [key] : key });
      }
    }
  }

  const { componentsPath, pagesPath  } = getProjectStructurePath(structure);

  const st: ScriptType = scriptType || packageData?.smart.scriptType as ScriptType || 'js';

  const projectOption: SmartProjectOption = {
    scriptType: st,
    projectType: projectType || packageData?.smart.projectType as ProjectType,
    modeType: modeType || 'start',
    dirName: projectDir || PROJECT_ROOT_PATH.split('/').pop() as string,
    name: packageData?.name as unknown as string || 'Smart App',
  };

  const serverOption: SmartServerOptionType = getServerOption({ port: port || defaultData.port, host: host || defaultData.host, htmlPath: htmlPath || buildDir });

  let smartPages: SmartCreatePage | undefined;
  let smartComponents: SmartCreatePage | undefined;

  if (pages) {
    smartPages = { dirPath: pagesPath, scriptType: st, names: getCreateNames(pages) };
  }

  if (components && projectDir) {
    smartComponents = { dirPath: componentsPath, scriptType: st, names: getCreateNames(components) };
  }

  return {
    cli,
    projectOption,
    serverOption,
    pages: smartPages,
    components: smartComponents,
    configOption: { ...defaultData, port: serverOption.port, host: serverOption.host },
  };
}

function getHtmlPath(htmlPath: string | undefined): string {
  if (!htmlPath) {
    return PROJECT_ROOT_PATH + '/index.html';
  }
  htmlPath = htmlPath.startsWith('/') ? htmlPath.substr(1, htmlPath.length) : htmlPath;
  htmlPath = htmlPath.endsWith('.html') ? htmlPath : htmlPath.endsWith('/') ? htmlPath + 'index.html' : htmlPath + '/index.html';

  return PROJECT_ROOT_PATH + '/' + htmlPath;
}

function getServerOption({ port, host, htmlPath }: SmartServerParamsType): SmartServerOptionType {
  return {
    port: Number(port) || 3000,
    host: host || '127.0.0.1',
    htmlPath: getHtmlPath(htmlPath),
  };
}

function getServerTaskOption(serverParam: SmartServerParamsType): SmartTaskOption {
  return {
    cli: 'server',
    serverOption: getServerOption(serverParam),
  };
}
