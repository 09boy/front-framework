declare module 'assets/*';
declare module 'src/*';
declare module './*';
declare module 'react-dom';
declare module 'react-router-dom';

declare interface NodeModule {
  hot: {
    accept(path?: string, fn: () => void, callback?: () => void): void;
  };
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}