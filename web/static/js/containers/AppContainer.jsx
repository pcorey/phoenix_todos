import App from '../layouts/App.jsx';
import { connect } from "react-redux";

const AppContainer = connect(state => state)(App);

export default AppContainer;
