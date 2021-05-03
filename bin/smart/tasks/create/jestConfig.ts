import { ProjectType } from 'types/SmartProjectConfig';

const JestData: Record<string, any> = {
  verbose: true,
  testEnvironment: 'node', // 测试环境
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // 忽略覆盖率的目录
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__test__/',
  ],
};

export function getJestConfigData(projectType: ProjectType): Record<string, any> {
  if (projectType === 'react') {
    JestData.preset = 'react';
  }
  return JestData;
}
