"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProjectStructure = createProjectStructure;

var _shelljs = require("shelljs");

var _path = require("../../../share/path");

function parseData(obj, parentPath) {
  const paths = [];
  const keys = Object.keys(obj);
  Object.values(obj).map((s, i) => {
    let cp = `${parentPath}/${keys[i]}`;

    if (typeof s === 'object' && !Array.isArray(s)) {
      if (Object.hasOwnProperty.call(s, 'name')) {
        cp = `${parentPath}/${s.name}`;
        delete s.name;
        paths.push(cp, ...parseData(s, cp));
      }
    } else if (Array.isArray(s)) {
      paths.push(cp, ...s.map(c => `${cp}/${c}`));
    } else if (typeof s === 'string') {
      paths.push(`${parentPath}/${s}`);
    }
  });
  return paths;
}

function createProjectStructure(projectType, projectName, structure) {
  const copyStructure = { ...structure
  };
  delete copyStructure.src;
  const paths = [structure.src, '__test__', ...parseData(copyStructure, structure.src)];
  (0, _shelljs.cd)(projectName);
  (0, _shelljs.mkdir)(paths);
  const imagesPath = `${structure.src}/assets/images/`;
  (0, _shelljs.cp)('-f', _path.SMART_ROOT_PATH + '/smart.favicon.ico', imagesPath + 'favicon.ico');
  (0, _shelljs.cp)('-f', _path.SMART_ROOT_PATH + '/smart.logo.png', imagesPath + 'smart.logo.png');
}