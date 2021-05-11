import { ProjectType } from 'types/SmartProjectConfig';

const JestData: Record<string, any> = {
  verbose: true,
  testEnvironment: 'node', // 测试环境
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: [],
  // 忽略覆盖率的目录
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__test__/',
  ],
};

export function getJestConfigData(projectType: ProjectType): Record<string, any> {

  switch (projectType) {
    case 'normal':
      JestData.moduleFileExtensions = ['ts', 'js', 'json', 'node'];
      break;
    case 'react':
      JestData.preset ='react';
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
