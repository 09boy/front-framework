import { readFileSync } from 'fs';
import { join } from 'path';
import { ScriptType, ProjectType } from 'types/SmartProjectConfig';

export function getTemplateData(projectType: ProjectType, scriptType: ScriptType): {
  indexData: string;
  appData: string;
} {
  let indexData = '';
  let appData = '';

  if (projectType === 'normal') {
    console.log('');
  } else if (projectType === 'react') {
    indexData = readFileSync(join(__dirname, '..', '..', `templates/react/${scriptType}/index.${scriptType}`), 'utf-8');
    appData = readFileSync(join(__dirname, '..', '..', `templates/react/${scriptType}/app.${scriptType}x`), 'utf-8');
  }

  return {
    indexData,
    appData,
  };
}
