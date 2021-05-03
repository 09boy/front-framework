"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogType = void 0;
let LogType;
exports.LogType = LogType;

(function (LogType) {
  LogType[LogType["configFileLoadFailed"] = 1000] = "configFileLoadFailed";
  LogType[LogType["cliNotExist"] = 2000] = "cliNotExist";
  LogType[LogType["cliArgTypeError"] = 2001] = "cliArgTypeError";
  LogType[LogType["projectExist"] = 3000] = "projectExist";
  LogType[LogType["projectNotExist"] = 3001] = "projectNotExist";
})(LogType || (exports.LogType = LogType = {}));