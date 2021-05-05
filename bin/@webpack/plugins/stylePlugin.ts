import { WebpackPluginInstance } from 'webpack';
import  MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { isDevEnv } from 'share/env';

export function getStylePlugin(): WebpackPluginInstance[] {
  const devMode = isDevEnv();
  let filename = '[name].css';
  let chunkFilename = '[id].css';

  const plugins: WebpackPluginInstance[] = [];

  if (!devMode) {
    filename = 'styles/[name].[contenthash].min.css';
    chunkFilename = 'styles/[id].[contenthash].min.css';
  }

  return [
    new MiniCssExtractPlugin({ filename, chunkFilename, ignoreOrder: false, }),
    ...plugins,
  ];
}
