import WebApp from 'pages/app';

WebApp();

if (process.env.NODE_ENV === 'development' && module['hot']) {
  module['hot'].accept('pages/app', WebApp);
}
