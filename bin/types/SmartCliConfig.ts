import { SmartCliType } from './Smart';
import { ChoiceCollection, QuestionTypeName } from 'inquirer';


export interface SmartInquirerOption {
  name: string;
  value: string;
  type?: QuestionTypeName;
  children?: ChoiceCollection | SmartInquirerOption;
  validate?: any;
  [key: string]: any;
}

export type SmartCommandsOption = {
  name: string;
  alias: string;
  desc: string;
  callback?: (a?: any) => any;
  options?: Record<string, any>[];
}

export interface CommandsOption {
  name?: string;
  alias?: string;
  desc?: string;
  callback?: (a?: any) => any;
  options?: Record<string, any>[];
  children?: SmartCommandsOption[];
  interactive: SmartInquirerOption | SmartInquirerOption[];
}

export type Commands = {
  [key in keyof SmartCliType]: CommandsOption;
}

export interface SmartCliConfig {
  port: string | number;
  host: string | number;
  Commands: Commands;
}

