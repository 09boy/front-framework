"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseData = parseData;
exports.parseProjectStructure = parseProjectStructure;

/***
 * if value is null to use key
 * **/
function parseProjectStructure(structure) {
  const ps = parseData(structure);
  console.log(ps, structure.assets);
}

function parseData(structure, parentPath = '') {
  parentPath = (structure === null || structure === void 0 ? void 0 : structure.src) || 'src';
  const paths = [parentPath];

  for (const key in structure) {
    if (key === 'src') {
      continue;
    }

    if (Object.hasOwnProperty.call(structure, key)) {
      const value = structure[key];

      if (typeof value === null || typeof value === 'undefined') {
        paths.push(parentPath + '/' + key);
      }

      if (typeof value === 'string') {
        paths.push(parentPath + '/' + value);
      }

      if (Array.isArray(value)) {
        const p = `${parentPath}/${key}`;
        paths.push(...value.map(s => `${p}/${s}`));
      }
    }
  }

  return paths;
}