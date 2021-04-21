"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SmartInquirer = SmartInquirer;

var _inquirer = _interopRequireDefault(require("inquirer"));

var _log = require("../share/log");

var _projectHelper = require("../share/projectHelper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parsePages(value) {
  if (!value) {
    return (0, _log.getLogErrorStr)('Please enter the page name!');
  }

  return true;
}

function parseProjectName(value) {
  if (!value) {
    return (0, _log.getLogErrorStr)('Please enter the project name!');
  }

  if (!(0, _projectHelper.isValidProjectName)(value.trim())) {
    return (0, _log.getLogErrorStr)(`The '${value.trim()}' project is already exist.`);
  }

  return true;
}

function applyValidate(option) {
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

  return { ...option,
    validate
  };
}

async function parseValues({
  result,
  data
}) {
  if (data) {
    const copyResult = { ...result
    };
    const {
      children,
      name,
      key
    } = data;
    const copyData = applyValidate(data);
    const args = await _inquirer.default.prompt(copyData);

    if (key) {
      args[key] = args[name];
      delete args[name];
    }

    copyResult.args = { ...copyResult.args,
      ...args
    };
    return parseValues({
      result: copyResult,
      data: children
    });
  }

  return result;
}

const smartOption = {
  name: 'name',
  message: 'What do you want to do?',
  type: 'list',
  choices: []
};

async function SmartInquirer(data) {
  smartOption.choices = data.map(({
    name,
    value
  }) => ({
    name: name,
    value: value
  }));
  const {
    name
  } = await _inquirer.default.prompt([smartOption]);
  const option = data.filter(({
    value,
    type
  }) => value === name && !!type)[0];
  return parseValues({
    result: {
      cliName: name
    },
    data: option
  });
}