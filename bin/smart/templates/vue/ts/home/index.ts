import './style';
import logo from 'assets/images/smart.logo.png';

const HomePage = {
  template: `
    <div class="wrapper">
      <img src="${logo}" alt="logo">
      <h1>Welcome!</h1>
      <div>
        <a href="https://09boy.net" target="_blank">Website</a>
        <a href="https://github.com/09boy/front-framework" target="_blank">Github</a>
        <a href="https://09boy.net" target="_blank">Npm</a>
      </div>  
    </div>
  `,
};

export default HomePage;