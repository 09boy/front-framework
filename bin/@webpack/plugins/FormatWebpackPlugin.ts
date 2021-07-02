import { Compiler, Compilation, sources }  from 'webpack';
import { promises } from 'fs';
import Prettier, { Options as PrettierOptions }  from 'prettier';
import { sed, touch } from 'shelljs';

const pluginName = 'FormatWebpackPlugin';

interface Option {
}

let isChecking = true;

export default class FormatWebpackPlugin {
  private readonly _option: Option = {};
  // private _initDone = false;

  constructor(option: Option) {
    this._option = option;
  }

  apply({ hooks }: Compiler) {
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

interface FileValue {
  text: string;
  options?: PrettierOptions | undefined;
}

async function checkoutUpdateFile(file?: string): Promise<FileValue | undefined> {
  if (!file) {
    return;
  }
  const options: PrettierOptions | null = await Prettier.resolveConfig(file);
  const text = await promises.readFile(file, 'utf8');
  const isUpdate = Prettier.check(text, {...options});
  console.log('isUpdate ====', isUpdate, options);
  return !isUpdate ? {
    text,
    options: options || undefined
  } : undefined;
}

async function watchFile({ hooks, modifiedFiles, context }: Compiler): Promise<void> {
  if (!isChecking) {
    isChecking = true;
    return;
  }

  const file = modifiedFiles?.values().next().value;
  const values = await checkoutUpdateFile(file);

  if (!values) {
    return Promise.resolve();
  }

  const currentFile = file.split('/').pop();

  const formatted = await Prettier.format(values.text, values.options);
  // await promises.writeFile(file, formatted, 'utf-8');

  isChecking = false;
  console.log('你好色彩', context);

  process.exit();



  hooks.thisCompilation.tap(pluginName, compilation => {
    console.log('======', compilation.name, compilation.compilerPath, compilation.assets);
    compilation.hooks.succeedModule.tap(pluginName, f => {
      console.log('>>>成功', f.originalSource()?.source());

    });
    compilation.hooks.finishModules.tap(pluginName, ()=> {
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