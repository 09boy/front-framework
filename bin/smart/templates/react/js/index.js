import React from 'react';
import ReactDOM from 'react-dom';

const render = async () => {
    const App = (await import('<pagesPath>/app')).default;
    ReactDOM.render(<App />, document.querySelector('#app'));
};

render().finally();

if (process.env.NODE_ENV === 'development' && module['hot']) {
    module['hot'].accept('<pagesPath>/app', render);
}
