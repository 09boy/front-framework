// export type EnvType = 'development' | 'production';

export type EnvModeType = 'start' | 'test' | 'staging' | 'release';

export type ProjectType = 'normal' | 'react' | 'vue' | 'nodejs' | 'miniProgram';
export type ScriptType = 'js' | 'ts';
// export type AssetsType = 'images' | 'fonts' | 'styles' | 'media' | 'svg';

export interface SmartConfigData {
  type: ProjectType;
  scriptType: ScriptType;
  host: string;
  port: number;
  buildDir: string;
  publicPath: string;
  devtool?: string;
  base64Limit?: number;
  eslintEnabled?: boolean;
  loaderIncludes?: string[];
  vendors?: Record<string, string[]> | string[];
  provide?: Record<string, string>;
  favicon?: string;
  alias?: Record<string, string>;
  globalVar: Record<string, any>; // global env var
}