import App from '../layouts/App.jsx';
import React from 'react';

export default class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      loading: false,
      connected: true,
      menuOpen: false,
      lists: []
    };
  }

  render() {
    return (<App {...this.state} {...this.props}/>);
  }
};
