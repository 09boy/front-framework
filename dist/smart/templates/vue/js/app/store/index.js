import { createStore } from 'vuex';
import actions from '../actions';
import mutations from '../mutations';
import modules from '../modules';

const store = createStore({
  state: {
    version: '1.0.0',
  },
  mutations,
  actions,
  modules,
  strict: process.env.NODE_ENV !== 'production',
});

export default store;