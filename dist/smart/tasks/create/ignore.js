"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIgnoreData = getIgnoreData;
const gitData = ['# OSX', '#', '.DS_Store', '.vscode/', '# node.js', '#', 'node_modules/', 'npm-debug.log', 'yarn-error.log', '#Editor', '.idea/*', '.vscode/*'];

function getIgnoreData(projectType, ignores) {
  return [...gitData, ...ignores];
}