const rootDom = document.querySelector('#app');

let preApp;

function render() {
  if (preApp) {
    preApp.unmount();
  }

  rootDom.innerHTML = '<router-view></router-view>';
  const App = require('pages/app').default;
  App.mount('#app');
  preApp = App;
}

render();

if (process.env.NODE_ENV === 'development' && module['hot']) {
  module['hot'].accept('pages/app', render);
}
