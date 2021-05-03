#!/usr/bin/env node
"use strict";

var _projectHelper = require("./share/projectHelper");

var _configHelper = require("./share/configHelper");

var _env = require("./share/env");

var _cli = _interopRequireDefault(require("./cli"));

var _smart = _interopRequireDefault(require("./smart"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function App() {
  const isSTProject = (0, _projectHelper.isSmartProject)();
  const smartCli = isSTProject ? _env.developProjectCli : _env.createProjectCli;
  const smartCommandValue = await (0, _cli.default)(smartCli);
  const smartTaskValue = await (0, _configHelper.getSmartConfigureData)(isSTProject, smartCommandValue);
  smartTaskValue && (await (0, _smart.default)(smartTaskValue));
}

App().finally(() => {
  console.log('');
});