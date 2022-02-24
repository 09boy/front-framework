import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfiguration from '@webpack';
import { getConfigData } from 'share/smartHelper';
import { PROJECT_ROOT_PATH } from 'share/path';

const app = express();

export async function startDevServe(option?: Record<string, any>): Promise<void> {
  const configData = await getConfigData(option);
  const config = webpackConfiguration(configData);
  const compiler = webpack(config);
  const { port, host } = configData;

  app.use(express.static(`${PROJECT_ROOT_PATH}${configData.buildDir}`));

  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output?.publicPath as string || '/',
  }));

  app.use(webpackHotMiddleware(compiler as any));

  app.get('*', function(req, res) {
    // res.sendFile( PROJECT_ROOT_PATH + configData.buildDir + '/index.html');
    compiler.outputFileSystem.readFile(PROJECT_ROOT_PATH + configData.buildDir + '/index.html', (err,data) => {
      res.set('content-type','text/html');
      res.send(data);
      res.end();
    })
  })

  app.listen(port, function() {
    console.log(`Current app listening on http://${host}:${port}!\n`);
  });
}

export function startServer(port: number, path: string): void {
  app.use(express.static(path));
  app.get('*', function(req, res) {
    res.sendFile(path + '/index.html');
  })
  app.listen(port, function() {
    console.log(`Current app listening on http://127.0.0.1:${port}!\n`);
  });
}
