import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// route components
import AppContainer from './containers/AppContainer.jsx';
import AuthPageJoin from './pages/AuthPageJoin.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <Route path="join" component={AuthPageJoin}/>
      <Route path="*" component={NotFoundPage}/>
    </Route>
  </Router>
);
