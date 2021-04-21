"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createPages;

var _path = require("path");

var _fs = require("fs");

var _ProjectType = require("../../../types/ProjectType");

var _tool = require("../../../share/tool");

var _shelljs = require("shelljs");

async function createPages(names, {
  structure,
  projectType,
  scriptingLanguageType
}) {
  scriptingLanguageType = scriptingLanguageType || _ProjectType.ProjectLanguageType.Javascript;
  const {
    pagesPath
  } = (0, _tool.getProjectPaths)(structure);
  const routConfigPath = pagesPath + '/route.config.' + scriptingLanguageType + 'x';
  const dirPaths = names.map(s => pagesPath + '/' + (0, _tool.getComponentDirName)(s));
  await (0, _shelljs.mkdir)('-p', dirPaths);
  const pageNames = [];

  if (projectType === 'react') {
    for (let i = 0; i < dirPaths.length; i++) {
      const s = dirPaths[i];
      const dirName = s.split('/').pop();
      const className = (0, _tool.getClassName)(names[i]);
      await parseReact(scriptingLanguageType, s, className);
      pageNames.push({
        dirName,
        className
      });
    }
  }

  console.log(pageNames, dirPaths);
  await updateRouteConfig(routConfigPath, pageNames);
}

async function parseReact(languageType, savePath, ClassName) {
  const indexFilePath = (0, _path.join)(__dirname, '..', '..', '/templates/react/', languageType, `/page/index.${languageType}x`);
  const styleFilepath = (0, _path.join)(__dirname, '..', '..', '/templates/react/', languageType, '/page/style.scss');
  let indexData = await (0, _fs.readFileSync)(indexFilePath, 'utf-8');
  indexData = indexData.replace(/<PageName>/g, ClassName);
  let styleData = await (0, _fs.readFileSync)(styleFilepath, 'utf-8');
  styleData = styleData.replace(/<PageName>/g, ClassName);
  await (0, _fs.writeFileSync)(savePath + '/index.' + languageType + 'x', indexData, 'utf-8');
  await (0, _fs.writeFileSync)(savePath + '/style.scss', styleData, 'utf-8');
}

async function updateRouteConfig(configPath, pageNames) {
  const routeConfigData = await (0, _fs.readFileSync)(configPath, 'utf-8');
  const [importsData, contentData] = routeConfigData.split('const');
  const newImports = importsData.trim() + '\n' + pageNames.map(o => `import ${o.className}Screen from 'pages/${o.dirName}';`).join('\n');
  await (0, _fs.writeFileSync)(configPath, newImports + '\n\n' + 'const' + contentData, 'utf-8');
}

module.exports = exports.default;