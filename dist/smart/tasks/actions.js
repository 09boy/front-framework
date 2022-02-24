"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;
exports.upgrade = upgrade;

var _smartHelper = require("../../share/smartHelper");

var _child_process = require("child_process");

var _path = require("../../share/path");

async function build(option) {
  const configData = await (0, _smartHelper.getConfigData)(option);
  process.env.buildData = JSON.stringify(configData);
  const child = (0, _child_process.exec)(`${_path.SMART_ROOT_PATH}/node_modules/.bin/webpack --config ${_path.SMART_ROOT_PATH}/dist/@webpack/index.js --color`);
  child.stdout?.on('data', function (d) {
    console.log(d);
  });
  child.stdout?.on('end', function () {
    console.log('** build end **');
  });
}

function upgrade() {//
}