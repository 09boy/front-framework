import inquirer, { ListQuestionOptions, QuestionTypeName, ChoiceCollection } from 'inquirer';
import { getLogErrorStr } from 'share/log';
import { SmartCliResultType } from './index';
import { isValidProjectName } from 'share/projectHelper';

type Option = {
  name: string;
  value: string;
  type?: QuestionTypeName;
  children?: ChoiceCollection;
  validate?: string;
  [key: string]: any;
};

type ChildOption = {
  result: SmartCliResultType;
  data?: Option | any;
};

export type InquirerDataType = Option[];

function parsePages(value: string): boolean | string {
  if (!value) {
    return getLogErrorStr('Please enter the page name!');
  }
  return true;
}

function parseProjectName(value: string): boolean | string {
  if (!value) {
    return getLogErrorStr('Please enter the project name!');
  }

  if (!isValidProjectName(value.trim())) {
    return getLogErrorStr(`The '${value.trim()}' project is already exist.`);
  }
  return true;
}


function applyValidate(option: any): any {
  let validate;
  switch (option.validate) {
    case 'parsePages':
      validate = parsePages;
      break;
    case 'parseProjectName':
      validate = parseProjectName;
      break;
    default:
      break;
  }

  return { ...option, validate };
}

async function parseValues({ result, data }: ChildOption): Promise<SmartCliResultType> {
  if (data) {
    const copyResult: SmartCliResultType = { ...result };
    const { children, name, key } = data;
    const copyData = applyValidate(data);
    const args: any = await inquirer.prompt(copyData);
    if (key) {
      args[key] = args[name];
      delete args[name];
    }
    copyResult.args = { ...copyResult.args, ...args };
    return parseValues({ result: copyResult, data: children });
  }
  return result;
}

const smartOption: ListQuestionOptions = {
  name: 'name',
  message: 'What do you want to do?',
  type: 'list',
  choices: [],
};

export async function SmartInquirer(data: InquirerDataType): Promise<SmartCliResultType | undefined> {
  smartOption.choices = data.map(({ name, value }) => ({ name: name, value: value }));
  const { name } = await inquirer.prompt([smartOption]);
  const option = data.filter(({ value, type }) => value === name && !!type)[0];
  return parseValues({ result: { cliName: name }, data: option });
}
