/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  // preset: 'ts-nodejs',
  verbose: true,
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  // collectCoverage: true, // 统计覆盖率
  testEnvironment: 'node', // 测试环境
  /*transform: {
    '^.+\\.ts?$': 'ts-jest' // 匹配 .ts
  },*/
  // 忽略覆盖率的目录
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__test__/',
    '/dist/'
  ],
};
