"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SmartInquirer;

var _inquirer = _interopRequireDefault(require("inquirer"));

var _log = require("../share/log");

var _projectHelper = require("../share/projectHelper");

var _parseFun = require("./parseFun");

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

function parsePort(value) {
  (0, _parseFun.parsePortByCli)(value);
  return true;
}

function applyValidate(option) {
  let validate;

  switch (option.callback) {
    case 'parsePort':
      validate = parsePort;
      break;

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

async function parseValues(cliName, cliArgs, option) {
  const {
    cli,
    projectType
  } = (0, _parseFun.parseSmartCliByCli)(cliName);
  const args = {
    projectType,
    ...cliArgs
  };

  if (option) {
    const {
      children,
      name,
      key
    } = option;
    const copyOption = applyValidate(option);
    const values = await _inquirer.default.prompt(copyOption);

    if (key && typeof key === 'string') {
      let keyValue = values[name];

      if (Array.isArray(keyValue)) {
        keyValue = keyValue[0];
      }

      if (key !== 'port' && keyValue.includes(',')) {
        keyValue = keyValue.split(',');
      }

      Object.assign(args, {
        [key]: keyValue
      });
    } else {
      Object.assign(args, { ...values
      });
    }

    return parseValues(cliName, args, children);
  }

  return {
    cli,
    args
  };
}

const smartOption = {
  name: 'name',
  message: 'What do you want to do?',
  type: 'list',
  choices: []
};

async function SmartInquirer(data) {
  data = data.map(o => applyValidate(o));
  smartOption.choices = data.map(({
    name,
    value
  }) => ({
    name: name,
    value: value
  }));
  const {
    name: cliName
  } = await _inquirer.default.prompt([smartOption]);
  const option = data.filter(({
    value,
    type
  }) => value === cliName && !!type)[0];
  return parseValues(cliName, {}, option);
}

module.exports = exports.default;