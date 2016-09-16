import React from 'react';
import AuthPage from './AuthPage.jsx';
import { Link } from 'react-router';
import { connect } from "react-redux";
import { signUp } from "../actions";

class JoinPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signUp: props.signUp
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    const password_confirm = this.refs.password_confirm.value;

    this.state.signUp(email, password, password_confirm)
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
        <h1 className="title-auth">Join.</h1>
        <p className="subtitle-auth" >Joining allows you to make private lists</p>
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
          <div className={`input-symbol ${errorClass('password_confirm')}`}>
            <input type="password" name="password_confirm" ref="password_confirm" placeholder="Confirm Password"/>
            <span className="icon-lock" title="Confirm Password"></span>
          </div>
          <button type="submit" className="btn-primary">Join Now</button>
        </form>
      </div>
    );

    const link = <Link to="/signin" className="link-auth-alt">Have an account? Sign in</Link>;

    return <AuthPage content={content} link={link}/>;
  }
}

JoinPage.contextTypes = {
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
      signUp: (email, password, password_confirm) => {
        return dispatch(signUp(email, password, password_confirm));
      }
    };
  }
)(JoinPage);
