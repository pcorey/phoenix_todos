import ListPage from '../pages/ListPage.jsx';
import { connect } from "react-redux";
import _ from "lodash";

const ListPageContainer = connect(
  (state, props) => {
    let id = props.params.id;
    let list = _.find(state.lists, list => list.id == id);
    return {
      loading: state.loading,
      list: list,
      listExists: !!list,
      todos: _.get(list, "todos") || []
    }
  }
)(ListPage);

export default ListPageContainer;
