import React from 'react';
import ListHeader from '../components/ListHeader.jsx';
import TodoItem from '../components/TodoItem.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import Message from '../components/Message.jsx';
import { connect } from "react-redux";
import {
  addTask,
  setCheckedStatus,
  updateName,
  deleteList,
  deleteTodo
} from "../actions";

class ListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editingTodo: null,
    };
    this.onEditingChange = this.onEditingChange.bind(this);
  }

  onEditingChange(id, editing) {
    this.setState({
      editingTodo: editing ? id : null,
    });
  }

  render() {
    const { list, listExists, loading, todos } = this.props;
    const { editingTodo } = this.state;

    if (!listExists) {
      return <NotFoundPage/>;
    }

    let Todos;
    if (!todos || !todos.length) {
      Todos = (
        <Message
          title="No tasks here"
          subtitle="Add new tasks using the field above"
        />
      );
    } else {
      Todos = todos
        .sort((a, b) => {
          let diff = new Date(a.inserted_at) - new Date(b.inserted_at);
          return diff == 0 ? a.text > b.text : diff;
        })
        .map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          editing={todo.id === editingTodo}
          onEditingChange={this.onEditingChange}
          setCheckedStatus={this.props.setCheckedStatus}
          deleteTodo={this.props.deleteTodo}
        />
      ));
    }

    return (
      <div className="page lists-show">
        <ListHeader list={list}
                    addTask={this.props.addTask}
                    updateName={this.props.updateName}
                    deleteList={this.props.deleteList}/>
        <div className="content-scrollable list-items">
          {loading ? <Message title="Loading tasks..."/> : Todos}
        </div>
      </div>
    );
  }
}

ListPage.propTypes = {
  list: React.PropTypes.object,
  todos: React.PropTypes.array,
  loading: React.PropTypes.bool,
  listExists: React.PropTypes.bool,
};


export default connect(
    (state) => state,
    (dispatch) => ({
      addTask: (list_id, text) => {
        return dispatch(addTask(list_id, text));
      },
      setCheckedStatus: (todo_id, status) => {
        return dispatch(setCheckedStatus(todo_id, status));
      },
      updateName: (list_id, name) => {
        return dispatch(updateName(list_id, name));
      },
      deleteList: (list_id) => {
        return dispatch(deleteList(list_id));
      },
      deleteTodo: (todo_id) => {
        return dispatch(deleteTodo(todo_id));
      }
    })
)(ListPage);
