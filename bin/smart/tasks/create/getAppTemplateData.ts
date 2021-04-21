import { readFileSync } from 'fs';
import { join } from 'path';
import { ProjectLanguageType, ProjectType } from 'types/ProjectType';

export async function getTemplateData(projectType: ProjectType, projectLanguageType: ProjectLanguageType) {
  let indexData = '';
  let appData = '';

  if (projectType === 'normal') {

  } else if (projectType === 'react') {
    indexData = await readFileSync(join(__dirname, '..', '..', `templates/react/${projectLanguageType}/index.${projectLanguageType}`), 'utf-8');
    appData = await readFileSync(join(__dirname, '..', '..', `templates/react/${projectLanguageType}/app.${projectLanguageType}x`), 'utf-8');
  }

  return {
    indexData,
    appData,
  };
}
