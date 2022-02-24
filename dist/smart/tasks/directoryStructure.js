"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDirectoryStructure = createDirectoryStructure;

var _util = _interopRequireDefault(require("util"));

var _child_process = require("child_process");

var _path = require("path");

var _promises = require("fs/promises");

var _smartHelper = require("../../share/smartHelper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const exec = _util.default.promisify(_child_process.exec);

async function mkDirs(structure, rootPath) {
  for (const key in structure) {
    if (Object.hasOwnProperty.call(structure, key)) {
      const value = structure[key];

      if (typeof value === 'string') {
        await (0, _promises.mkdir)(rootPath + '/' + value);
      } else {
        const childRoot = value[0];

        for (const name of value) {
          await (0, _promises.mkdir)(rootPath + `/${name === childRoot ? '' : childRoot + '/'}` + name);
        }
      }
    }
  }
}

async function createDirectoryStructure(path, type, sType) {
  const dirStructure = _smartHelper.defaultDirStructure[type];
  const src = dirStructure.root;
  const rootPath = path + '/' + src;
  await (0, _promises.mkdir)(rootPath);
  const otherStructure = { ...dirStructure
  };
  delete otherStructure.root;
  await mkDirs(otherStructure, rootPath);
  const fileType = type === 'react' ? sType === 'js' ? 'jsx' : 'tsx' : sType;
  const indexPath = (0, _path.resolve)(__dirname, '..', `templates/${type}/${sType}.index.${fileType}`);
  const appPath = (0, _path.resolve)(__dirname, '..', `templates/${type}/${sType}.app.${fileType}`);
  const appStyle = (0, _path.resolve)(__dirname, '..', `templates/${type}/style.css`);
  await exec(`cp ${indexPath} ${path}/index.${fileType}`);
  await exec(`cp ${appPath} ${rootPath}/app.${fileType}`);
  await exec(`cp ${appStyle} ${rootPath}/`);

  if (type === 'react') {
    const pagePath = typeof dirStructure.pages === 'string' ? dirStructure.pages : dirStructure.pages[0];
    const homePagePath = (0, _path.resolve)(__dirname, '..', `templates/${type}/home/${sType}.index.${fileType}`);
    const aboutPagePath = (0, _path.resolve)(__dirname, '..', `templates/${type}/about/${sType}.index.${fileType}`);
    await exec(`cp ${homePagePath} ${rootPath}/${pagePath}/home/index.${fileType}`);
    await exec(`cp ${aboutPagePath} ${rootPath}/${pagePath}/about/index.${fileType}`);
  }
}