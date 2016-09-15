import ReactDOM from "react-dom";
import reducers from "./reducers";
import { createStore } from "redux";
import { renderRoutes } from "./routes.jsx";

const store = createStore(reducers);
const el = document.getElementById("app");

function render() {
  ReactDOM.render(renderRoutes(store), el);
}

render();
store.subscribe(render);
