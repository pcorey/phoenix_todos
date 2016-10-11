import React from 'react';
import { Link } from 'react-router';
/* import { insert } from '../../api/lists/methods.js';*/

export default class ListList extends React.Component {
  constructor(props) {
    super(props);

    this.createNewList = this.createNewList.bind(this);
  }

  createNewList() {
    const { router } = this.context;
    this.props.createList(router);
  }

  render() {
    const { lists } = this.props;
    return (
      <div className="list-todos">
        <a className="link-list-new" onClick={this.createNewList}>
          <span className="icon-plus"></span>
          New List
        </a>
        {lists.map(list => (
          <Link
            to={`/lists/${ list.id }`}
            key={list.id}
            title={list.name}
            className="list-todo"
            activeClassName="active"
          >
            {list.user_id
              ? <span className="icon-lock"></span>
              : null}
            {list.incomplete_count
              ? <span className="count-list">{list.incomplete_count}</span>
              : null}
            {list.name}
          </Link>
        ))}
      </div>
    );
  }
}

ListList.propTypes = {
  lists: React.PropTypes.array,
};

ListList.contextTypes = {
  router: React.PropTypes.object,
};
