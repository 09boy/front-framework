import { promises } from 'fs';
import { rm } from 'shelljs';
import { ScriptType } from 'types/SmartProjectConfig';

export type ContentItemType = {
  indent: number;
  data: {
    [key in  ScriptType]?: string;
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

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (num <= 0) {
      break;
    }
    indentStr += marker;
    num--;
  }
  return indentStr;
}

function getIndentStr(item: ContentItemType, parentIndent: number, type: ScriptType): string {
  const { indent, data, upEmptyLine, end, children } = item;
  const startIndent = parentIndent + indent;

  let str = `${getMaker(upEmptyLine || 0, '\n')}${data[type] || ''}`;

  str = `${getMaker(startIndent, '\t')}${str}`;

  if (children) {
    str +=  '\n' + getFileContent(children, startIndent + 1, type);
  }

  if (end) {
    str += getMaker(startIndent, '\t') + end;
  }

  return str;
}

export function getFileContent(data: ContentItemType[], parentIndent = 0, type: ScriptType = 'js'): string {
  let content = '';
  data.map(s => {
    content += getIndentStr(s, parentIndent, type) + '\n';
  });
  return content;
}

export async function parseJsonFileToJsFile(fileName: string): Promise<void> {
  const jsonName = `${fileName}.json`;
  const data = await promises.readFile(jsonName, 'utf-8');
  rm(jsonName);

  let content = 'module.exports = ';
  data.replace(/"/g, '\'').split('\n').forEach(line => {
    if (line.indexOf('\'') === 2) {
      line = line.replace('\'', '').replace('\'', '');
    }
    content += line + '\n';
  });

  content = content.substring(0, content.length -1) + ';';
  await promises.writeFile(`${fileName}.js`, content);
}
