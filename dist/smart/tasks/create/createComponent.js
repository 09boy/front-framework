"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createComponents;

var _shelljs = require("shelljs");

var _path = require("path");

var _fs = require("fs");

var _projectHelper = require("../../../share/projectHelper");

var _path2 = require("../../../share/path");

function createComponents(projectType, {
  names,
  scriptType,
  dirPath
}) {
  // const { componentsPath } = getProjectPaths(structure);
  const indexFile = _path2.PROJECT_ROOT_PATH + '/' + dirPath + '/index.' + scriptType;

  if (!(0, _shelljs.test)('-f', indexFile)) {
    (0, _shelljs.touch)(indexFile);
  }

  const dirPaths = names.map(n => `${_path2.PROJECT_ROOT_PATH}/${dirPath}/${(0, _projectHelper.getComponentDirName)(n)}`);
  (0, _shelljs.mkdir)('-p', dirPaths);
  const indexData = (0, _fs.readFileSync)(indexFile, 'utf-8');
  const indexDatas = indexData.split('\n').filter(s => !!s);
  dirPaths.map((n, i) => {
    const className = (0, _projectHelper.getClassName)(names[i]);
    const pageDirName = n.split('/').pop();
    indexDatas.push(`export * from './${pageDirName}';`);

    if (projectType === 'react') {
      parseReact(scriptType, pageDirName, className);
    }
  });
  (0, _fs.writeFileSync)(indexFile, indexDatas.join('\n').trim(), 'utf-8');
}

function parseReact(scriptType, savePath, ClassName) {
  const indexFilePath = (0, _path.join)(__dirname, '..', '..', '/templates/react/', scriptType, `/components/index.${scriptType}x`);
  const styleFilepath = (0, _path.join)(__dirname, '..', '..', '/templates/react/', scriptType, '/components/style.scss');
  let indexData = (0, _fs.readFileSync)(indexFilePath, 'utf-8');
  indexData = indexData.replace(/<ComponentName>/g, ClassName);
  let styleData = (0, _fs.readFileSync)(styleFilepath, 'utf-8');
  styleData = styleData.replace(/<ComponentName>/g, ClassName);
  (0, _fs.writeFileSync)(savePath + '/index.' + scriptType + 'x', indexData, 'utf-8');
  (0, _fs.writeFileSync)(savePath + '/style.scss', styleData, 'utf-8');
}

module.exports = exports.default;