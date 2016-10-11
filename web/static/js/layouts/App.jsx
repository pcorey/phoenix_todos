import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import UserMenu from '../components/UserMenu.jsx';
import ListList from '../components/ListList.jsx';
import ConnectionNotification from '../components/ConnectionNotification.jsx';
import Loading from '../components/Loading.jsx';
import { connect } from "react-redux";
import { signOut, createList } from "../actions";

const CONNECTION_ISSUE_TIMEOUT = 5000;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      showConnectionIssue: false,
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      /* eslint-disable react/no-did-mount-set-state */
      this.setState({ showConnectionIssue: true });
    }, CONNECTION_ISSUE_TIMEOUT);
  }

  componentWillReceiveProps({ loading, children }) {
    // redirect / to a list once lists are ready
    if (!loading && !children && this.props.lists.length) {
      const list = this.props.lists[0];
      this.context.router.replace(`/lists/${ list.id }`);
    }
  }

  toggleMenu(menuOpen = !Session.get('menuOpen')) {
    Session.set({ menuOpen });
  }

  logout() {
    this.props.signOut(this.props.jwt)
      .then((success) => {
        if (success) {
          // if we are on a private list, we'll need to go to a public one
          if (this.props.params.id) {
            const list = _.find(this.props.lists, list => list.id == this.props.params.id);
            if (list.user_id) {
              const publicList = _.find(this.props.list, list => !list.user_id);
              this.context.router.push(`/lists/${ publicList.id }`);
            }
          }
        }
      });
  }

  render() {
    const { showConnectionIssue } = this.state;
    const {
      user,
      connected,
      loading,
      lists,
      menuOpen,
      children,
      location,
    } = this.props;

    const closeMenu = this.toggleMenu.bind(this, false);

    // clone route components with keys so that they can
    // have transitions
    const clonedChildren = children && React.cloneElement(children, {
      key: location.pathname,
    });

    return (
      <div id="container" className={menuOpen ? 'menu-open' : ''}>
        <section id="menu">
          <UserMenu user={user} logout={this.logout}/>
          <ListList lists={lists} createList={this.props.createList}/>
        </section>
        {showConnectionIssue && !connected
          ? <ConnectionNotification/>
          : null}
        <div className="content-overlay" onClick={closeMenu}></div>
        <div id="content-container">
          <ReactCSSTransitionGroup
            transitionName="fade"
            transitionEnterTimeout={200}
            transitionLeaveTimeout={200}
          >
            {loading
              ? <Loading key="loading"/>
              : clonedChildren}
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  user: React.PropTypes.object,      // current meteor user
  connected: React.PropTypes.bool,   // server connection status
  loading: React.PropTypes.bool,     // subscription status
  menuOpen: React.PropTypes.bool,    // is side menu open?
  lists: React.PropTypes.array,      // all lists visible to the current user
  children: React.PropTypes.element, // matched child route component
  location: React.PropTypes.object,  // current router location
  params: React.PropTypes.object,    // parameters of the current route
};

App.contextTypes = {
  router: React.PropTypes.object,
};

export default connect(
    (state) => state,
    (dispatch) => ({
      signOut: (jwt) => {
        return dispatch(signOut(jwt));
      },
      createList: (router) => {
        return dispatch(createList(router));
      }
    })
)(App);
