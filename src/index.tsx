import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import Thunk from "redux-thunk";

import rootReducer from "./reducers/index";
import App from "./components/App/App";

import "sweetalert2/src/sweetalert2.scss";
import "./index.scss";

const store = createStore(rootReducer, applyMiddleware(Thunk));

ReactDOM.render(
	<Provider store={store}>
		<Router basename="/">
			<App />
		</Router>
	</Provider>,
	document.getElementById("root")
);
