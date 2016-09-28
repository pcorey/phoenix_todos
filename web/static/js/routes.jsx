import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from "react-redux";

// route components
import AppContainer from './containers/AppContainer.jsx';
import AuthPageSignIn from './pages/AuthPageSignIn.jsx';
import AuthPageJoin from './pages/AuthPageJoin.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ListPageContainer from './containers/ListPageContainer.jsx';

export const renderRoutes = (store) => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={AppContainer}>
        <Route path="lists/:id" component={ListPageContainer}/>
        <Route path="signin" component={AuthPageSignIn}/>
        <Route path="join" component={AuthPageJoin}/>
        <Route path="*" component={NotFoundPage}/>
      </Route>
    </Router>
  </Provider>
);
