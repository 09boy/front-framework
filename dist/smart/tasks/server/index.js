"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Server = void 0;

var _express = _interopRequireDefault(require("express"));

var _log = require("../../../share/log");

var _path = require("../../../share/path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Server {
  constructor({
    port,
    host,
    htmlPath
  }) {
    const ps = htmlPath === null || htmlPath === void 0 ? void 0 : htmlPath.split('/');
    ps === null || ps === void 0 ? void 0 : ps.pop();
    const buildDir = (ps === null || ps === void 0 ? void 0 : ps.pop()) || 'dist';
    this.port = port;
    this.host = host;
    this.htmlPath = htmlPath;
    this.app = (0, _express.default)();
    this.app.use(_express.default.static(_path.PROJECT_ROOT_PATH + '/' + buildDir));
    this.app.use(_express.default.static(_path.PROJECT_ROOT_PATH + '/' + buildDir + '/home'));
  }

  addHook(handles) {
    if (Array.isArray(handles)) {
      handles.map(h => this.app.use(h));
    } else {
      this.app.use(handles);
    }
  }

  start() {
    if (!this.app) {
      (0, _log.LogError)('Server instance not found!');
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

exports.Server = Server;