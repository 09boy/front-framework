import { ChoiceCollection, QuestionTypeName } from 'inquirer';
import { ScriptType } from 'types/SmartType';

export type SmartCliCommandNameType = 'create' | 'start' | 'build' | 'server' | 'test' | 'upgrade';


export interface SmartInquirerOption {
  name: string;
  value: string;
  type?: QuestionTypeName;
  children?: ChoiceCollection | SmartInquirerOption;
  validate?: any;
  [key: string]: any;
}

export interface SmartCommandOption  {
  name: string;
  alias: string;
  desc: string;
  callback?: (a?: any) => any;
  options?: Record<string, any>[];
  children?: SmartCommandOption[];
  interactive?: SmartInquirerOption | SmartInquirerOption[];
}

export interface SmartResultOption {
  projectName?: string;
  projectType?: string;
  scriptType?: ScriptType;
  port?: number;
  host?: string;
  pages?: string[];
  components?: string[];
  buildModeType?: string;
}

export type SmartCommandResult = {
  commandName: SmartCliCommandNameType;
  option?: SmartResultOption;
};

export type SmartCliConfigData = {
  [key in string]: SmartCommandOption;
};
