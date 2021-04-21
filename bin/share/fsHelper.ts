import { readFileSync, writeFileSync } from 'fs';
import { rm } from 'shelljs';
import { ProjectLanguageType } from 'types/ProjectType';

export type ContentItemType = {
  indent: number;
  data: {
    [key in  ProjectLanguageType]?: string;
  };
  upEmptyLine?: number;
  children?: ContentItemType[];
  end?: string;
};

function getMaker(num: number, marker: string): string {
  let indentStr = '';
  if (num === 0) {
    return indentStr;
  }

  while (true) {
    if (num <= 0) {
      break;
    }
    indentStr += marker;
    num--;
  }
  return indentStr;
}

function getIndentStr(item: ContentItemType, parentIndent: number, type: ProjectLanguageType): string {
  const { indent, data, upEmptyLine, end, children } = item;
  const startIndent = parentIndent + indent;

  let str = getMaker(upEmptyLine || 0, '\n') + data[type];

  str = `${getMaker(startIndent, '\t')}${str}`;

  if (children) {
    str +=  '\n' + getFileContent(children, startIndent + 1, type);
  }

  if (end) {
    str += getMaker(startIndent, '\t') + end;
  }

  return str;
}

export function getFileContent(data: ContentItemType[], parentIndent = 0, type: ProjectLanguageType = ProjectLanguageType.Javascript): string {
  let content = '';
  data.map(s => {
    content += getIndentStr(s, parentIndent, type) + '\n';
  });
  return content;
}

export async function parseJsonFileToJsFile(fileName: string) {
  const jsonName = `${fileName}.json`;
  const data = await readFileSync(jsonName, 'utf-8');
  rm(jsonName);

  let content = 'module.exports = ';
  data.replace(/"/g, '\'').split('\n').forEach(line => {
    if (line.indexOf('\'') === 2) {
      line = line.replace('\'', '').replace('\'', '');
    }
    content += line + '\n';
  });

  content = content.substring(0, content.length -1) + ';';
  writeFileSync(`${fileName}.js`, content);
}
