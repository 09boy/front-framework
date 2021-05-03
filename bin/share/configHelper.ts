import jsYaml from 'js-yaml';
import { join } from 'path';
import { readFileSync } from 'fs';
import { PrintLog } from 'share/log';
import { PROJECT_ROOT_PATH } from 'share/path';
import { SmartOption,
  SmartTaskOption,
  SmartCreatePage,
  SmartServerOptionType,
  SmartProjectOption } from 'types/Smart';
import { LogType } from 'types/LogType';
import { ProjectType, ScriptType, SmartConfigOption, PackageData } from 'types/SmartProjectConfig';
import { getCreateNames, getProjectStructurePath } from 'share/projectHelper';

export async function getSmartConfigureData(isSTProject: boolean, option: SmartOption): Promise<SmartTaskOption> {
  const { cli, args: { projectType, port, host, htmlPath }  } = option;
  if (cli === 'upgrade' || cli === 'server') {
    return {
      cli,
      serverOption: {
        port: Number(port) || 3000,
        host: host || '127.0.0.1',
        htmlPath: htmlPath || PROJECT_ROOT_PATH,
      }
    };
  }

  try {
    const packageData: PackageData | undefined = ['start', 'build', 'page', 'component'].includes(cli) ? await import(`${PROJECT_ROOT_PATH}/package.json`) as PackageData : undefined;
    const path = !isSTProject ? `${PROJECT_ROOT_PATH}/smart.config.yml` : join(__dirname, `config/template/${projectType || 'normal'}.smart.config.yml`);
    const smartConfigData =  jsYaml.load(readFileSync(path, 'utf8')) as SmartConfigOption;
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
  const { componentsPath, pagesPath  } = getProjectStructurePath(structure);

  const st: ScriptType = scriptType || packageData?.smart.scriptType as ScriptType || 'js';

  const projectOption: SmartProjectOption = {
    scriptType: st,
    projectType: projectType || packageData?.smart.projectType as ProjectType,
    modeType: modeType || 'start',
    dirName: projectDir || PROJECT_ROOT_PATH.split('/').pop() as string,
    name: packageData?.name as unknown as string || 'Smart App',
  };

  const serverOption: SmartServerOptionType = {
    port: Number(port) || Number(defaultData.port) || 3000,
    host: host || defaultData.host,
    htmlPath: htmlPath || `${buildDir}/index.html`,
  };

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
