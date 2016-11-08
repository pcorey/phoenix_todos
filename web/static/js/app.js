import ReactDOM from "react-dom";
import reducers from "./reducers";
import { createStore, applyMiddleware } from "redux";
import { renderRoutes } from "./routes.jsx";
import thunkMiddleware from "redux-thunk";
import {
  connectSocket,
  joinListsChannel
} from "./actions";

const store = createStore(
  reducers,
  applyMiddleware(thunkMiddleware)
);
const el = document.getElementById("app");

function render() {
  ReactDOM.render(renderRoutes(store), el);
}

render();

store.dispatch(connectSocket(store.getState().jwt));
