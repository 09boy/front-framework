import React from 'react';
import ReactDOM from 'react-dom';

const rootEl = document.querySelector('.root');

function render() {
  import('src/app').then(App => ReactDOM.render(<App.default />, rootEl));
}

render();

if(module['hot']) {
  module.hot.accept('src/app', function () {
    render();
  })
}