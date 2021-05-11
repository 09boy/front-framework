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
  moduleFileExtensions: [],
  // 忽略覆盖率的目录
  coveragePathIgnorePatterns: ['/node_modules/', '/__test__/']
};

function getJestConfigData(projectType) {
  switch (projectType) {
    case 'normal':
      JestData.moduleFileExtensions = ['ts', 'js', 'json', 'node'];
      break;

    case 'react':
      JestData.preset = 'react';
      JestData.moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx', 'json', 'node'];
      break;

    case 'vue':
      JestData.moduleFileExtensions = ['ts', 'js', 'vux', 'json', 'node'];
      break;

    case 'nodejs':
      JestData.moduleFileExtensions = ['ts', 'js', 'json', 'node'];
      break;

    case 'miniProgram':
      break;
  }

  return JestData;
}