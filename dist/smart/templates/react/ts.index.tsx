import { ComponentType } from 'react';
import ReactDOM from 'react-dom';

const rootEl: HTMLElement | null = document.querySelector('.root');

function render(): void {
  if (rootEl) {
    import('./src/app').then((App?: { default: ComponentType }) => {
      if (App) {
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