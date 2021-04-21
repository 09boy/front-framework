import React from 'react';
import ReactDOM from 'react-dom';

const render = async () => {
  const App = (await import('pages/app')).default;
  ReactDOM.render(<App />, document.querySelector('#app'));
};

render().catch(error => console.log(error));

if (process.env.NODE_ENV === 'development' && module['hot']) {
  module['hot'].accept('pages/app', render);
}
