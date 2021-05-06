import { cd, mkdir, touch } from 'shelljs';
import { SmartProjectOption } from 'types/Smart';

export default function intProject({ projectType, modeType, scriptType, name, dirName }: SmartProjectOption): void {
  mkdir(dirName);
  cd(dirName);

}
