import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import reducer from '../reducers';

export default configureStore({
    reducer,
    middleware(getDefaultMiddleware) {
        const defaultMiddleware =  getDefaultMiddleware();
        return process.env.NODE_ENV === 'development' ? defaultMiddleware.concat(createLogger()) : defaultMiddleware;
    },
    devTools: process.env.NODE_ENV !== 'production',
});
