import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

export default class TodoItem extends React.Component {
  constructor(props) {
    super(props);
    this.throttledUpdate = _.throttle(value => {
      if (value) {
        updateText.call({
          todoId: this.props.todo.id,
          newText: value,
        }, alert);
      }
    }, 300);

    this.setTodoCheckStatus = this.setTodoCheckStatus.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onFocus() {
    this.props.onEditingChange(this.props.todo.id, true);
  }

  onBlur() {
    this.props.onEditingChange(this.props.todo.id, false);
  }

  setTodoCheckStatus(event) {
    this.props.setCheckedStatus(this.props.todo.id, event.target.checked);
  }

  updateTodo(event) {
    this.throttledUpdate(event.target.value);
  }

  deleteTodo() {
    this.props.deleteTodo(this.props.todo.id);
  }

  render() {
    const { todo, editing } = this.props;
    const todoClass = classnames({
      'list-item': true,
      checked: todo.checked,
      editing,
    });

    return (
      <div className={todoClass}>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={todo.checked}
            name="checked"
            onChange={this.setTodoCheckStatus}
          />
          <span className="checkbox-custom"></span>
        </label>
        <input
          type="text"
          defaultValue={todo.text}
          placeholder="Task name"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.updateTodo}
        />
        <a
          className="delete-item"
          href="#"
          onClick={this.deleteTodo}
          onMouseDown={this.deleteTodo}
        >
          <span className="icon-trash"></span>
        </a>
      </div>
    );
  }
}

TodoItem.propTypes = {
  todo: React.PropTypes.object,
  editing: React.PropTypes.bool,
  onEditingChange: React.PropTypes.func,
};
