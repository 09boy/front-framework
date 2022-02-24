import ReactDOM from 'react-dom';

const rootEl: HTMLElement | null = document.querySelector('.root');

function render() {
  if (rootEl) {
    import('./src/app').then((App?: Record<string, any>) => {
      if (App?.default) {
        ReactDOM.render(<App.default />, rootEl);
      }
    }).catch(e => console.log(e));
  }
}

render();

if(module.hot) {
  module.hot.accept('src/app', function () {
    render();
  });
}