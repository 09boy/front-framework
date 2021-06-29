#!/usr/bin/env node
"use strict";

var _projectHelper = require("./share/projectHelper");

var _configHelper = require("./share/configHelper");

var _cli = _interopRequireDefault(require("./cli"));

var _smart = _interopRequireDefault(require("./smart"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function App() {
  const {
    isNewProject,
    smartCli
  } = (0, _projectHelper.initSmart)();
  const smartCommandValue = await (0, _cli.default)(smartCli);
  const smartTaskOption = await (0, _configHelper.getSmartConfigureData)(isNewProject, smartCommandValue);
  await (0, _smart.default)(smartTaskOption); // console.log('smartTaskOption: =', smartTaskOption);
}

App().finally(() => {
  console.log('');
});