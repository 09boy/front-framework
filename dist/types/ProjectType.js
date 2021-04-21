"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProjectLanguageType = exports.ProjectType = void 0;
let ProjectType;
exports.ProjectType = ProjectType;

(function (ProjectType) {
  ProjectType["Unknown"] = "unknown";
  ProjectType["Normal"] = "normal";
  ProjectType["React"] = "react";
  ProjectType["Vue"] = "vue";
  ProjectType["Nodejs"] = "nodejs";
  ProjectType["MiniProgram"] = "miniProgram";
})(ProjectType || (exports.ProjectType = ProjectType = {}));

let ProjectLanguageType;
exports.ProjectLanguageType = ProjectLanguageType;

(function (ProjectLanguageType) {
  ProjectLanguageType["Javascript"] = "js";
  ProjectLanguageType["Javascript1"] = "javascript";
  ProjectLanguageType["Typescript"] = "ts";
  ProjectLanguageType["Typescript1"] = "typescript";
})(ProjectLanguageType || (exports.ProjectLanguageType = ProjectLanguageType = {}));