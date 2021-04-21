import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import store from 'app/store';
import routes from './route.config';

const App: FC = () => (
  <Provider store={store}>
    <Router>
      <Switch>
        {routes.map((route, i) => (
          <Route
            key={i}
            path={route.path}
            render={route.component}
          />
        ))}
      </Switch>
    </Router>
  </Provider>
);

export default App;
