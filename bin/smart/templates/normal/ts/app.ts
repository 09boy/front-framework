import 'assets/styles/common';
import logo from 'assets/images/smart.logo.png'

const rootDom: Element | null = document.querySelector('#app');

export default function WebApp() {
  if (!rootDom) {
    return;
  }

  rootDom.childNodes.forEach(n => rootDom.removeChild(n));
  const wrapper = document.createElement('div');

  const title = document.createElement('h1');
  title.innerHTML = 'Welcome!';

  const websiteBtn = document.createElement('a');
  websiteBtn.innerHTML = 'Website';
  websiteBtn.href = 'https://09boy.net';
  websiteBtn.target = '_blank';

  const githubBtn = document.createElement('a');
  githubBtn.innerHTML = 'Github';
  githubBtn.href = 'https://github.com/09boy/front-framework';
  githubBtn.target = '_blank';

  const npmLinkBtn = document.createElement('a');
  npmLinkBtn.innerHTML = 'Npm';
  npmLinkBtn.href = 'https://09boy.net';
  npmLinkBtn.target = '_blank';

  const btnCon = document.createElement('div');
  btnCon.classList.add('btn-con');
  btnCon.appendChild(websiteBtn);
  btnCon.appendChild(githubBtn);
  btnCon.appendChild(npmLinkBtn);

  const image = document.createElement('img');
  image.src = logo;

  wrapper.appendChild(image);
  wrapper.appendChild(title);
  wrapper.appendChild(btnCon);
  rootDom.appendChild(wrapper);
}