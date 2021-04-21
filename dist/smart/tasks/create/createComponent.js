"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createComponents;

var _shelljs = require("shelljs");

var _path = require("path");

var _fs = require("fs");

var _tool = require("../../../share/tool");

var _ProjectType = require("../../../types/ProjectType");

async function createComponents(names, {
  structure,
  projectType,
  scriptingLanguageType
}) {
  scriptingLanguageType = scriptingLanguageType || _ProjectType.ProjectLanguageType.Javascript;
  const {
    componentsPath
  } = (0, _tool.getProjectPaths)(structure);
  const indexFile = componentsPath + '/index.' + scriptingLanguageType;

  if (!(0, _shelljs.test)('-f', indexFile)) {
    await (0, _shelljs.touch)(indexFile);
  }

  const dirPaths = names.map(s => componentsPath + '/' + (0, _tool.getComponentDirName)(s));
  await (0, _shelljs.mkdir)('-p', dirPaths);
  const dirNames = [];

  if (projectType === 'react') {
    for (let i = 0; i < dirPaths.length; i++) {
      const s = dirPaths[i];
      const dirName = s.split('/').pop();
      await parseReact(scriptingLanguageType, s, (0, _tool.getClassName)(names[i]));
      dirNames.push(dirName);
    }
  }

  const indexData = await (0, _fs.readFileSync)(indexFile, 'utf-8');
  const indexDatas = indexData.split('\n').filter(s => !!s);
  dirNames.map(dirName => {
    indexDatas.push(`export * from './${dirName}';`);
  });
  await (0, _fs.writeFileSync)(indexFile, indexDatas.join('\n').trim(), 'utf-8');
}

async function parseReact(languageType, savePath, ClassName) {
  const indexFilePath = (0, _path.join)(__dirname, '..', '..', '/templates/react/', languageType, `/components/index.${languageType}x`);
  const styleFilepath = (0, _path.join)(__dirname, '..', '..', '/templates/react/', languageType, '/components/style.scss');
  let indexData = await (0, _fs.readFileSync)(indexFilePath, 'utf-8');
  indexData = indexData.replace(/<ComponentName>/g, ClassName);
  let styleData = await (0, _fs.readFileSync)(styleFilepath, 'utf-8');
  styleData = styleData.replace(/<ComponentName>/g, ClassName);
  await (0, _fs.writeFileSync)(savePath + '/index.' + languageType + 'x', indexData, 'utf-8');
  await (0, _fs.writeFileSync)(savePath + '/style.scss', styleData, 'utf-8');
}

module.exports = exports.default;