import { ProjectType } from 'types/ProjectType';

const gitData = [
  '# OSX',
  '#',
  '.DS_Store',

  '.vscode/',

  '# node.js',
  '#',
  'node_modules/',
  'npm-debug.log',
  'yarn-error.log',

  '#Editor',
  '.idea/*',
  '.vscode/*',
];

export function getIgnoreData(projectType: ProjectType, ignores: string[]): string[] {
  return [...gitData, ...ignores];
}
