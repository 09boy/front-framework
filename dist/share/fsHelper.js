"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileContent = getFileContent;
exports.parseJsonFileToJsFile = parseJsonFileToJsFile;

var _fs = require("fs");

var _shelljs = require("shelljs");

function getMaker(num, marker) {
  let indentStr = '';

  if (num === 0) {
    return indentStr;
  } // eslint-disable-next-line no-constant-condition


  while (true) {
    if (num <= 0) {
      break;
    }

    indentStr += marker;
    num--;
  }

  return indentStr;
}

function getIndentStr(item, parentIndent, type) {
  const {
    indent,
    data,
    upEmptyLine,
    end,
    children
  } = item;
  const startIndent = parentIndent + indent;
  let str = `${getMaker(upEmptyLine || 0, '\n')}${data[type] || ''}`;
  str = `${getMaker(startIndent, '\t')}${str}`;

  if (children) {
    str += '\n' + getFileContent(children, startIndent + 1, type);
  }

  if (end) {
    str += getMaker(startIndent, '\t') + end;
  }

  return str;
}

function getFileContent(data, parentIndent = 0, type = 'js') {
  let content = '';
  data.map(s => {
    content += getIndentStr(s, parentIndent, type) + '\n';
  });
  return content;
}

function parseJsonFileToJsFile(fileName) {
  const jsonName = `${fileName}.json`;
  const data = (0, _fs.readFileSync)(jsonName, 'utf-8');
  (0, _shelljs.rm)(jsonName);
  let content = 'module.exports = ';
  data.replace(/"/g, '\'').split('\n').forEach(line => {
    if (line.indexOf('\'') === 2) {
      line = line.replace('\'', '').replace('\'', '');
    }

    content += line + '\n';
  });
  content = content.substring(0, content.length - 1) + ';';
  (0, _fs.writeFileSync)(`${fileName}.js`, content);
}