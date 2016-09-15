import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from "react-redux";

// route components
import AppContainer from './containers/AppContainer.jsx';
import AuthPageJoin from './pages/AuthPageJoin.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export const renderRoutes = (store) => (
  <Provider store={store}>
    <Router history={browserHistory}>
        <Route path="/" component={AppContainer}>
        <Route path="join" component={AuthPageJoin}/>
        <Route path="*" component={NotFoundPage}/>
        </Route>
    </Router>
  </Provider>
);
