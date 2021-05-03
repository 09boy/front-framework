import { SmartCliType } from 'types/Smart';

export function isDevEnv(): boolean {
  return process.env.NODE_ENV === 'development' || !process.env.BuildConfig;
}

export const createProjectCli: SmartCliType[] = ['init', 'create', 'server', 'upgrade'];
export const developProjectCli: SmartCliType[] = ['server', 'start', 'page', 'component', 'build', 'upgrade'];
