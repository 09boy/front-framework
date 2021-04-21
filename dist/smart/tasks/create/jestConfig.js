"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJestConfigData = getJestConfigData;

var _ProjectType = require("../../../types/ProjectType");

const JestData = {
  verbose: true,
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};

function getJestConfigData(projectType, srcDir, projectLanguageType = _ProjectType.ProjectLanguageType.Javascript) {
  const isTs = projectLanguageType === _ProjectType.ProjectLanguageType.Typescript;
  JestData.testMatch = [`${srcDir}/__tests__/*.js`];

  if (isTs) {
    JestData.testMatch.push(`${srcDir}/__tests__/*.ts`);
  }

  if (projectType === 'react') {
    JestData.preset = 'react';
  }

  return JestData;
}