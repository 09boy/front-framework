"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrettierConfigData = getPrettierConfigData;
const defaultData = {
  bracketSpacing: false,
  jsxBracketSameLine: true,
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
  tabWidth: 2
};

function getPrettierConfigData(projectType) {
  const cpData = { ...defaultData
  };

  switch (projectType) {
    case 'normal':
      delete cpData.jsxBracketSameLine;
      return cpData;

    case 'react':
    case 'vue':
    case 'nodejs':
    case 'miniProgram':
      return cpData;
  }
}