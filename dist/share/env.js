"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.developProjectCli = exports.createProjectCli = void 0;
exports.isDevEnv = isDevEnv;

function isDevEnv() {
  return process.env.NODE_ENV === 'development' || !process.env.BuildConfig;
}

const createProjectCli = ['create', 'server', 'upgrade'];
exports.createProjectCli = createProjectCli;
const developProjectCli = ['server', 'start', 'page', 'component', 'build', 'upgrade'];
exports.developProjectCli = developProjectCli;