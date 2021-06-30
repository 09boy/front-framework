import jsYaml from 'js-yaml';
import { join } from 'path';
import { readFileSync } from 'fs';
import { PrintLog } from 'share/log';
import { PROJECT_ROOT_PATH } from 'share/path';
import { SmartOption,
  SmartTaskOption,
  SmartCreatePage,
  SmartProjectOption,
  SmartCliArgs } from 'types/Smart';
import { LogType } from 'types/LogType';
import { SmartConfigOption, PackageData, SmartStructureOption, ProjectType } from 'types/SmartProjectConfig';
import { getCreateNames, isValidProjectName } from 'share/projectHelper';


export async function getSmartConfigureData(isNewProject: boolean, { cli, args }: SmartOption): Promise<SmartTaskOption> {
  if (cli === 'upgrade') {
    return { cli };
  }

  // if only start server
  if (isNewProject && cli === 'server') {
    return getServerTaskOption(args);
  }

  if (isNewProject && args?.projectDir) {
    if (!isValidProjectName(args.projectDir)) {
      PrintLog(LogType.projectExist, args.projectDir);
      process.exit(0);
    }
  }

  try {
    let packageData: PackageData | undefined = undefined;
    let smartConfigPath: string = join(__dirname, '..', `smart/templates/smart-config/${args?.projectType || 'normal'}.smart.config.yml`);

    if (!isNewProject) {
      smartConfigPath = `${PROJECT_ROOT_PATH}/smart.config.yml`;
      packageData = await import(`${PROJECT_ROOT_PATH}/package.json`) as PackageData;
    }

    const smartConfigData =  jsYaml.load(readFileSync(smartConfigPath, 'utf8')) as SmartConfigOption;
    return parseSmartOption({ cli, args }, smartConfigData, packageData);
  } catch (e) {
    PrintLog(LogType.configFileLoadFailed, (e as TypeError).message);
  }

  return {
    cli,
  };
}

/*
* @packageData if value is undefined, it is a new project will to create;
* */
export function parseSmartOption({ cli, args }: SmartOption, defaultData: SmartConfigOption, packageData?: PackageData): SmartTaskOption {

  if (cli === 'server') {
    return getServerTaskOption({ ...args, htmlPath: args?.htmlPath || defaultData.buildDir });
  }

  const projectOption: SmartProjectOption = {
    scriptType: args?.scriptType || 'js',
    projectType: args?.projectType || 'normal',
    modeType: args?.modeType || 'start',
    dirName: args?.projectDir || PROJECT_ROOT_PATH.split('/').pop() as string,
    name: packageData?.name || args?.projectDir || 'Smart Project',
  };

  const configOption: SmartConfigOption = {
    ...defaultData,
    structure: getStructure(projectOption.projectType),
    host: args?.host || defaultData.host,
    port: args?.port || defaultData.port,
  };

  if (packageData) {
    let smartPages: SmartCreatePage | undefined;
    let smartComponents: SmartCreatePage | undefined;

    if (cli === 'page' || cli === 'component') {
      const { pages, components, src  } = configOption.structure;
      if (args?.pages) {
        smartPages = { dirPath: `${src}/${pages}`, scriptType: packageData.smart.scriptType, names: getCreateNames(args.pages) };
      }

      if (args?.components && components) {
        smartComponents = { dirPath: `${src}/${components}`, scriptType: packageData.smart.scriptType, names: getCreateNames(args.components) };
      }
    }

    return {
      cli,
      projectOption: {
        ...projectOption,
        scriptType: packageData.smart.scriptType,
        projectType: packageData.smart.projectType,
      },
      configOption,
      serverOption: getServerTaskOption({ host: args?.host || defaultData.host, port: args?.port || defaultData.port, htmlPath: args?.htmlPath || defaultData.buildDir }).serverOption,
      pages: smartPages,
      components: smartComponents,
    };
  }

  // new project
  if (!args) {
    PrintLog(LogType.cliArgTypeError);
    process.exit(0);
  }
  return {
    cli,
    projectOption,
    configOption,
  };
}

function getStructure(projectType: ProjectType): SmartStructureOption {
  switch (projectType) {
    case "react":
    case "vue":
      return {
        src: 'src',
        pages: 'pages',
        assets: {
          images: 'images',
          styles: 'styles',
        },
        components: 'components',
        app: 'app',
      };
    case "nodejs":
      return {
        src: 'src',
        pages: 'routers',
        assets: 'assets',
      };
    case "miniProgram":
      return {
        src: 'src',
        pages: 'pages',
        assets: 'assets',
      };
    case "normal":
    default:
      return {
        src: 'src',
        pages: 'pages',
        assets: {
          images: 'images',
          styles: 'styles',
        },
      };
  }
}

function getHtmlPath(htmlPath?: string): string {
  if (!htmlPath) {
    return PROJECT_ROOT_PATH + '/dist/index.html';
  }
  htmlPath = htmlPath.startsWith('/') ? htmlPath.substr(1, htmlPath.length) : htmlPath;
  htmlPath = htmlPath.endsWith('.html') ? htmlPath : htmlPath.endsWith('/') ? htmlPath + 'index.html' : htmlPath + '/index.html';

  return PROJECT_ROOT_PATH + '/' + htmlPath;
}

function getServerTaskOption(args?: SmartCliArgs): SmartTaskOption {
  return {
    cli: 'server',
    serverOption: {
      port: args?.port || 4001,
      host: args?.host || '127.0.0.1',
      htmlPath:  getHtmlPath(args?.htmlPath),
    },
  };
}
