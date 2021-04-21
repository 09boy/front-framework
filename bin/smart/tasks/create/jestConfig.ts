import { ProjectLanguageType, ProjectType } from 'types/ProjectType';

const JestData: any = {
  verbose: true,
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

export function getJestConfigData(projectType: ProjectType, srcDir: string,  projectLanguageType: ProjectLanguageType = ProjectLanguageType.Javascript): object {
  const isTs = projectLanguageType === ProjectLanguageType.Typescript;
  JestData.testMatch = [`${srcDir}/__tests__/*.js`];

  if (isTs) {
    JestData.testMatch.push(`${srcDir}/__tests__/*.ts`);
  }

  if (projectType === 'react') {
    JestData.preset = 'react';
  }

  return JestData;
}
