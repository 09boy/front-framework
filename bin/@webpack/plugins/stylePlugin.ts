import { WebpackPluginInstance } from 'webpack';
import  MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

export function getStylePlugin(devMode: boolean): WebpackPluginInstance[] {
  let filename = '[name].css';
  let chunkFilename = '[id].css';

  const plugins: WebpackPluginInstance[] = [];

  if (!devMode) {
    filename = 'styles/[name].[contenthash].min.css';
    chunkFilename = 'styles/[id].[contenthash].min.css';
    plugins.push(new CssMinimizerPlugin({
      cache: true,
      parallel: true,

    }));
  }

  return [
    new MiniCssExtractPlugin({ filename, chunkFilename }),
    ...plugins,
  ]
}
