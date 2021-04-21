import express, { Application, RequestHandler } from 'express';
import { LogError } from 'share/log';
import { PROJECT_ROOT_PATH } from 'share/path';
import fs from 'fs';

export type ServerOptionType = {
  port?: string | number;
  host?: string;
  htmlPath?: string;
};

export class Server {
  private readonly app: Application;
  private readonly host: string;
  private readonly port: number | string;
  private readonly htmlPath: string;

  constructor({ port = 3000, host= '127.0.0.1', htmlPath = `${PROJECT_ROOT_PATH}/dist/index.html` }: ServerOptionType) {
    const ps =  htmlPath?.split('/');
    ps?.pop();
    const buildDir = ps?.pop() || 'dist';
    this.port = port;
    this.host = host;
    this.htmlPath = htmlPath;
    this.app = express();
    this.app.use(express.static(PROJECT_ROOT_PATH + '/' + buildDir));
    this.app.use(express.static(PROJECT_ROOT_PATH + '/' + buildDir + '/home'));
  }

  addHook(handles: RequestHandler | RequestHandler[]) {
    if (Array.isArray(handles)) {
      handles.map(h => this.app.use(h));
    } else {
      this.app.use(handles);
    }
  }

  start() {
    if (!this.app) {
      LogError('Server instance not found!');
      return;
    }
    this.app.get('*', (req, res) => {
      res.sendFile(this.htmlPath);
    });

    this.app.listen(this.port, () => {
      console.log(`Example app listening at http://${this.host}:${this.port}`);
    });
  }
}
