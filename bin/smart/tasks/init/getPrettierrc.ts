import { ProjectType } from 'types/SmartProjectConfig';

const defaultData = {
  bracketSpacing: false,
  jsxBracketSameLine: true,
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
  tabWidth: 2,
};

export function getPrettierConfigData(projectType: ProjectType): Record<string, any> {
  const cpData: Record<string, any> = {...defaultData};
  switch (projectType) {
    case 'normal':
      delete cpData.jsxBracketSameLine;
      return cpData;
    case 'react':
    case 'vue':
    case 'nodejs':
    case 'miniProgram':
      return cpData;
  }
}


