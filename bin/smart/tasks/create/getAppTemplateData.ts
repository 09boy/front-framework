import { readFileSync } from 'fs';
import { join } from 'path';
import { ScriptType, ProjectType } from 'types/SmartProjectConfig';

export function getTemplateData(projectType: ProjectType, scriptType: ScriptType): {
  indexData: string;
  appData: string;
} {
  const suffixName = projectType === 'react' ? `${scriptType}x` : `${scriptType}`;

  const indexData = readFileSync(join(__dirname, '..', '..', `templates/${projectType}/${scriptType}/index.${scriptType}`), 'utf-8');
  const appData = readFileSync(join(__dirname, '..', '..', `templates/${projectType}/${scriptType}/app.${suffixName}`), 'utf-8');

  return {
    indexData,
    appData,
  };
}


