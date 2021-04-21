import { CliType } from 'types/CliType';
import { CreateOptionType } from 'types/SmartConfigType';
import { EnvType } from 'types/EnvType';

export type SmartOptionType = {
  cliType: CliType;
  cliArgs?: {
    env?: EnvType;
    port?: string | number;
    host?: string;
    htmlPath?: string;
    pages?: string[];
    components?: string[];
    createOption?: CreateOptionType;
  };
};
