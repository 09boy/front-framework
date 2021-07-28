import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import store from 'app/store';
import routes from './route.config';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const App = createApp({});

App.use(store);

App.use(router);

export default App;