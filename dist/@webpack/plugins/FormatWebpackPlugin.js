"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _prettier = _interopRequireDefault(require("prettier"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const pluginName = 'FormatWebpackPlugin';
let isChecking = true;

class FormatWebpackPlugin {
  // private _initDone = false;
  constructor(option) {
    _defineProperty(this, "_option", {});

    this._option = option;
  }

  apply({
    hooks
  }) {
    hooks.watchRun.tapPromise(pluginName, watchFile);
    /*hooks.initialize.tap(pluginName, () => {
      const o = this._option;
      /!*
      * 0	Everything formatted properly
      * 1	Something wasn’t formatted properly
      * 2	Something’s wrong with Prettier
      * *!/
      exec(`npx prettier --check src/!**!/!*.js`, (code, stdout) => {
        console.log('真的初始化吗', o, code, stdout);
        if (code > 0) {
          exec('npx prettier -w src/!**!/!*.js --ignore-unknown', { async: true }, () => {
            this._initDone = true;
          });
        } else {
          this._initDone = true;
        }
      });
    });*/
  }

}

exports.default = FormatWebpackPlugin;

async function checkoutUpdateFile(file) {
  if (!file) {
    return;
  }

  const options = await _prettier.default.resolveConfig(file);
  const text = await _fs.promises.readFile(file, 'utf8');

  const isUpdate = _prettier.default.check(text, { ...options
  });

  console.log('isUpdate ====', isUpdate, options);
  return !isUpdate ? {
    text,
    options: options || undefined
  } : undefined;
}

async function watchFile({
  hooks,
  modifiedFiles,
  context
}) {
  if (!isChecking) {
    isChecking = true;
    return;
  }

  const file = modifiedFiles === null || modifiedFiles === void 0 ? void 0 : modifiedFiles.values().next().value;
  const values = await checkoutUpdateFile(file);

  if (!values) {
    return Promise.resolve();
  }

  const currentFile = file.split('/').pop();
  const formatted = await _prettier.default.format(values.text, values.options); // await promises.writeFile(file, formatted, 'utf-8');

  isChecking = false;
  console.log('你好色彩', context);
  process.exit();
  hooks.thisCompilation.tap(pluginName, compilation => {
    console.log('======', compilation.name, compilation.compilerPath, compilation.assets);
    compilation.hooks.succeedModule.tap(pluginName, f => {
      var _f$originalSource;

      console.log('>>>成功', (_f$originalSource = f.originalSource()) === null || _f$originalSource === void 0 ? void 0 : _f$originalSource.source());
    });
    compilation.hooks.finishModules.tap(pluginName, () => {
      console.log('>>>完成');
    });
    /*compilation.hooks.processAssets.tap({name: pluginName, stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL},  assets => {
      const hasKey = Object.keys(assets).includes(currentFile);
      if (hasKey) {
        console.log('>>>', hasKey);
        // compilation.updateAsset(currentFile, new sources.RawSource('你好'));
        /!*compilation.updateAsset(currentFile, source);*!/
      }
    })*/
  });
}

module.exports = exports.default;