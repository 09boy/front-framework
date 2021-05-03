"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createPages;

var _path = require("path");

var _fs = require("fs");

var _shelljs = require("shelljs");

var _path2 = require("../../../share/path");

var _projectHelper = require("../../../share/projectHelper");

function createPages(projectType, {
  names,
  scriptType,
  dirPath
}) {
  const routConfigPath = _path2.PROJECT_ROOT_PATH + '/' + dirPath + '/route.config.' + scriptType + 'x';
  const dirPaths = names.map(n => `${_path2.PROJECT_ROOT_PATH}/${dirPath}/${(0, _projectHelper.getComponentDirName)(n)}`);
  (0, _shelljs.mkdir)('-p', dirPaths); // const pageNames: {dirName: string; className: string;}[] = [];

  dirPaths.map((n, i) => {
    const className = (0, _projectHelper.getClassName)(names[i]);
    const pageDirName = n.split('/').pop();

    if (projectType === 'react') {
      parseReact(scriptType, n, className);
      updateRouteConfig(routConfigPath, className, dirPath + '/' + pageDirName);
    }
  });
  console.log(dirPaths);
}

function parseReact(scriptType, savePath, ClassName) {
  const indexFilePath = (0, _path.join)(__dirname, '..', '..', '/templates/react/', scriptType, `/page/index.${scriptType}x`);
  const styleFilepath = (0, _path.join)(__dirname, '..', '..', '/templates/react/', scriptType, '/page/style.scss');
  let indexData = (0, _fs.readFileSync)(indexFilePath, 'utf-8');
  indexData = indexData.replace(/<PageName>/g, ClassName);
  let styleData = (0, _fs.readFileSync)(styleFilepath, 'utf-8');
  styleData = styleData.replace(/<PageName>/g, ClassName);
  (0, _fs.writeFileSync)(savePath + '/index.' + scriptType + 'x', indexData, 'utf-8');
  (0, _fs.writeFileSync)(savePath + '/style.scss', styleData, 'utf-8');
}

function updateRouteConfig(configPath, className, pagePath) {
  const routeConfigData = (0, _fs.readFileSync)(configPath, 'utf-8');
  const [importsData, contentData] = routeConfigData.split('const');
  const newImports = importsData.trim() + '\n' + `import ${className}Screen from '${pagePath}';` + '\n';
  (0, _fs.writeFileSync)(configPath, newImports + '\n\n' + 'const' + contentData, 'utf-8');
}

module.exports = exports.default;