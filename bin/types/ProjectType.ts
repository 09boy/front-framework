export enum ProjectType {
  Unknown = 'unknown',
  Normal = 'normal',
  React = 'react',
  Vue = 'vue',
  Nodejs = 'nodejs',
  MiniProgram = 'miniProgram',
}

export type ProjectTypes = keyof typeof ProjectType;

export enum ProjectLanguageType {
  Javascript= 'js',
  Javascript1 = 'javascript',
  Typescript = 'ts',
  Typescript1 = 'typescript',
}

export type ProjectLanguageTypes = typeof ProjectLanguageType;
