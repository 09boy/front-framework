import { ls } from "shelljs";
import { ProjectType, ScriptType, SmartStructureOption } from "types/SmartProjectConfig";
import { getDynamicModule } from "share/projectHelper";
import { PROJECT_ROOT_PATH } from "share/path";

export function getResolveExtensions(projectType: ProjectType, scriptType: ScriptType): string[] {
  const extensions = [];
  switch (projectType) {
    case "react":
    {
      extensions.push('.js', '.jsx', '.css', '.scss', '.less');
      if (scriptType === 'ts') {
        extensions.unshift('.ts', '.tsx');
      }
      return extensions;
    }
    case "vue":
    {
      extensions.push('.js', '.css', '.scss', '.less', '.vue');
      if (scriptType === 'ts') {
        extensions.unshift('.ts');
      }
      return extensions;
    }
    case "nodejs":
    {
      extensions.push('.js', '.mjs');
      if (scriptType === 'ts') {
        extensions.unshift('.ts');
      }
      return extensions;
    }
    case "miniProgram":
    {
      extensions.push('.js', '.css', '.scss', '.less');
      if (scriptType === 'ts') {
        extensions.unshift('.ts');
      }
      return extensions;
    }
    case "normal":
    default:
    {
      extensions.push('.js', '.css', '.scss', '.less', '.mjs');
      if (scriptType === 'ts') {
        extensions.unshift('.ts');
      }
      return extensions;
    }
  }
}

export function getResolveAlias(projectType: ProjectType, srcDir: string): { [key: string]: string; } {
  const resolveAlias = {};
  const srcDirs: string[] = ls('-d', `${srcDir}/*`).stdout.trim().split('\n');
  srcDirs.map(p => {
    const dirKey = p.split('/')[1];
    Object.assign(resolveAlias, { [dirKey]: `${PROJECT_ROOT_PATH}/${p}`});
  });

  const alias = {
    '@babel/runtime-corejs3': getDynamicModule('@babel/runtime-corejs3'),
    ...resolveAlias,
  };

  if (projectType === 'react') {
    Object.assign(alias, {
      'react': PROJECT_ROOT_PATH + '/node_modules/react',
      'react-dom': PROJECT_ROOT_PATH + '/node_modules/@hot-loader/react-dom',
      '@hot-loader/react-dom': PROJECT_ROOT_PATH + '/node_modules/@hot-loader/react-dom',
    });
  }

  if (projectType === 'vue') {
    Object.assign(alias, {
      vue: PROJECT_ROOT_PATH + '/node_modules/vue/dist/vue.esm-bundler.js',
    });
  }

  return alias;
}

interface AssetsPaths {
  assetsPath: string;
  imagePath?: string;
  fontsPath?: string;
  mediasPath?: string;
  svgPath? : string;
}

export function getAssetsPath({ assets }: SmartStructureOption): AssetsPaths {
  if (typeof assets === 'string') {
    return {
      assetsPath: assets,
    };
  }

  return {
    assetsPath: 'assets/',
    imagePath: `assets/${assets.images || 'images'}`,
    fontsPath: `assets/${assets.fonts || 'fonts'}`,
    mediasPath: `assets/${assets.media || 'medias'}`,
    svgPath: `assets/${assets.svg || 'svg'}`,
  };
}