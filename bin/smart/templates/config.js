export const NODE_ENV = process.env.NODE_ENV;
export const DEBUG = process.env.DEBUG;

// parse global variables
// Built-in: SMART_ENV
// custom: SMART_ENV_[VALUE] -> smart.config.yml -> globalVar

let apiPath;
function parseModeEnv() {
  if (typeof SMART_ENV === 'object') {
    // parse your code
    // {key: value}
  }

  // string or default is '//';
  apiPath = SMART_ENV;
  return apiPath;
}
parseModeEnv();

export const API_PATH = apiPath;