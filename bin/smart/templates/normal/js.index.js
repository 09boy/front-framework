import print from 'src/app';
import logo from 'assets/images/smart.logo.png';
import * as Config from './Config';

const rootEl = document.querySelector('.root');

function render() {
  const img = document.createElement('img');
  img.src = logo;
  const container = document.createElement('div');
  container.className = 'container';
  const h3 = document.createElement('h3');
  h3.innerText = 'Normal Project';
  container.appendChild(h3);
  rootEl.appendChild(img);
  rootEl.appendChild(container);
  print();
  console.log(Config);
}

render();

if (module['hot']) {
  module['hot'].accept('src/app', function () {
    print(); // testing hot reload
  });
}