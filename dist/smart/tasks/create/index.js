"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProjectStructure = createProjectStructure;

var _shelljs = require("shelljs");

var _path = require("../../../share/path");

function parseData(structure, parentPath) {
  const paths = [];

  for (const k in structure) {
    if (!Object.hasOwnProperty.call(structure, k)) {
      continue;
    } // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment


    const value = structure[k];

    if (typeof value === 'string') {
      paths.push(`${parentPath}/${value}`);
    } else {
      paths.push(`${parentPath}/${k}`, ...parseData(value, `${parentPath}/${k}`));
    }
  }

  return paths;
}

async function createProjectStructure(projectType, projectName, structure) {
  const copyStructure = { ...structure
  };
  delete copyStructure.src;
  const paths = [structure.src, '__test__', ...parseData(copyStructure, structure.src)];
  await new Promise(resolve => {
    var _structure$assets, _structure$assets2;

    (0, _shelljs.mkdir)(paths);
    const imagesPath = typeof structure.assets === 'string' ? `./${structure.src}/${structure.assets}/` : `./${structure.src}/assets/${(_structure$assets = structure.assets) !== null && _structure$assets !== void 0 && _structure$assets.images ? (_structure$assets2 = structure.assets) === null || _structure$assets2 === void 0 ? void 0 : _structure$assets2.images : 'images'}/`;
    (0, _shelljs.cp)('-f', _path.SMART_ROOT_PATH + '/smart.favicon.ico', imagesPath + 'favicon.ico');
    (0, _shelljs.cp)('-f', _path.SMART_ROOT_PATH + '/smart.logo.png', imagesPath + 'smart.logo.png');
    resolve();
  });
}