import React from 'react';
import AuthPage from './AuthPage.jsx';
import { Link } from 'react-router';
import { connect } from "react-redux";
import { signIn } from "../actions";

class SignInPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signIn: props.signIn
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    const email = this.refs.email.value;
    const password = this.refs.password.value;

    this.state.signIn(email, password)
      .then((success) => {
        if (success) {
          this.context.router.push('/');
        }
      });
  }

  render() {
    const errors = (this.props.errors || []).reduce((errors, error) => {
      return Object.assign(errors, error);
    }, {});
    const errorMessages = Object.keys(errors).map(key => errors[key]);
    const errorClass = key => errors[key] && 'error';

    const content = (
      <div className="wrapper-auth">
        <h1 className="title-auth">Sign In.</h1>
        <p className="subtitle-auth" >Signing in allows you to view private lists</p>
        <form onSubmit={this.onSubmit}>
          <div className="list-errors">
            {errorMessages.map(msg => (
              <div className="list-item" key={msg}>{msg}</div>
            ))}
          </div>
          <div className={`input-symbol ${errorClass('email')}`}>
            <input type="email" name="email" ref="email" placeholder="Your Email"/>
            <span className="icon-email" title="Your Email"></span>
          </div>
          <div className={`input-symbol ${errorClass('password')}`}>
            <input type="password" name="password" ref="password" placeholder="Password"/>
            <span className="icon-lock" title="Password"></span>
          </div>
          <button type="submit" className="btn-primary">Sign in</button>
        </form>
      </div>
    );

    const link = <Link to="/join" className="link-auth-alt">Need an account? Join Now.</Link>;

    return <AuthPage content={content} link={link}/>;
  }
}

SignInPage.contextTypes = {
  router: React.PropTypes.object,
};

export default connect(
  (state) => {
    return {
      errors: state.errors
    }
  },
  (dispatch) => {
    return {
      signIn: (email, password) => {
        return dispatch(signIn(email, password));
      }
    };
  }
)(SignInPage);
