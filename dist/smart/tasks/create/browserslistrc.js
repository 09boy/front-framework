"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBrowserslistrcConfigData = getBrowserslistrcConfigData;
const browserslistrcData = ['# Browsers that we support', '', 'defaults', 'not IE 11', '> 0.25%', '# current node', 'supports es6-module'];

function getBrowserslistrcConfigData() {
  return [...browserslistrcData];
}