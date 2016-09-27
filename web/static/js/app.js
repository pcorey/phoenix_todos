import ReactDOM from "react-dom";
import reducers from "./reducers";
import { createStore, applyMiddleware } from "redux";
import { renderRoutes } from "./routes.jsx";
import thunkMiddleware from "redux-thunk";
import {
  addList
} from "./actions";
import socket from "./socket";

const store = createStore(
  reducers,
  applyMiddleware(thunkMiddleware)
);
const el = document.getElementById("app");

function render() {
  ReactDOM.render(renderRoutes(store), el);
}

render();
store.subscribe(render);

socket.connect();
socket.channel("lists.public", {})
    .join()
    .receive("ok", (res) => {
      res.forEach((list) => {
        store.dispatch(addList(list));
      });
    })
    .receive("error", (res) => {
        console.log("error", res);
    });
