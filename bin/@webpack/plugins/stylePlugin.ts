import { WebpackPluginInstance, AssetInfo } from 'webpack';
import  MiniCssExtractPlugin from 'mini-css-extract-plugin';

type Fun = (pathData: any, assetInfo?: AssetInfo) => string;
export function getStylePlugin(isDevMode: boolean): WebpackPluginInstance[] {
  let filename: string | Fun = '[name].css';
  let chunkFilename: string | Fun = '[id].css';

  if (!isDevMode) {
    filename = 'styles/[name].[contenthash].min.css';
    chunkFilename = 'styles/[id].[contenthash].min.css';
  }

  const plugins: WebpackPluginInstance[] = [];

  return [
    new MiniCssExtractPlugin({ filename, chunkFilename, experimentalUseImportModule: true, ignoreOrder: isDevMode }),
    ...plugins,
  ];
}
