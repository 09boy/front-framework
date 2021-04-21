#!/usr/bin/env node
"use strict";

var _fs = require("fs");

var _path = require("path");

var _jsYaml = _interopRequireDefault(require("js-yaml"));

var _projectHelper = require("./share/projectHelper");

var _tool = require("./share/tool");

var _path2 = require("./share/path");

var _log = require("./share/log");

var _cli = _interopRequireDefault(require("./cli"));

var _smart = _interopRequireDefault(require("./smart"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

async function getSmartConfigureData(isInitApp, cliResult) {
  const {
    cliName,
    args
  } = cliResult;

  if (cliName === 'upgrade' || !isInitApp && cliName === 'server') {
    return undefined;
  }

  const path = isInitApp ? `${_path2.PROJECT_ROOT_PATH}/smart.config.yml` : (0, _path.join)(__dirname, `config/template/${cliName.split('-')[1] || (args === null || args === void 0 ? void 0 : args.projectType) || 'normal'}.smart.config.yml`);
  let packageData = {};

  if (['start', 'build', 'page', 'component'].includes(cliName)) {
    packageData = await Promise.resolve(`${_path2.PROJECT_ROOT_PATH}/package.json`).then(s => _interopRequireWildcard(require(s)));
  }

  try {
    var _packageData, _packageData$smart, _packageData2;

    const smartConfigData = await _jsYaml.default.load((0, _fs.readFileSync)(path, 'utf8'));
    return { ...smartConfigData,
      structure: (0, _tool.parseStructure)(smartConfigData.structure, cliName.split('-')[1] || ((_packageData = packageData) === null || _packageData === void 0 ? void 0 : (_packageData$smart = _packageData.smart) === null || _packageData$smart === void 0 ? void 0 : _packageData$smart.projectType)),
      ...((_packageData2 = packageData) === null || _packageData2 === void 0 ? void 0 : _packageData2.smart),
      name: packageData.name
    };
  } catch (e) {
    (0, _log.LogError)(e);
  }
}

async function App() {
  const isInitApp = (0, _projectHelper.isSmartProject)();
  const filterCli = isInitApp ? ['create'] : ['start', 'build', 'page', 'component', 'page-child'];
  const cliResult = await (0, _cli.default)(filterCli);

  if (!cliResult) {
    return;
  }

  const smartConfigData = await getSmartConfigureData(isInitApp, cliResult);
  const data = (0, _projectHelper.parseCli)(cliResult, smartConfigData);
  console.log(cliResult);
  await (0, _smart.default)(data, { ...smartConfigData,
    ...data.cliArgs
  });
}

App().then(() => {});