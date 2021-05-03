"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJestConfigData = getJestConfigData;
const JestData = {
  verbose: true,
  testEnvironment: 'node',
  // 测试环境
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // 忽略覆盖率的目录
  coveragePathIgnorePatterns: ['/node_modules/', '/__test__/']
};

function getJestConfigData(projectType) {
  if (projectType === 'react') {
    JestData.preset = 'react';
  }

  return JestData;
}