import ReactDOM from "react-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import Thunk from "redux-thunk";

import rootReducer from "./reducers/index";
import App from "./components/App/App";

import "sweetalert2/src/sweetalert2.scss";
import "./index.scss";

const store = createStore(rootReducer, applyMiddleware(Thunk));
const router = createBrowserRouter([
	{
		path: "*",
		element: <App />,
	},
]);

ReactDOM.render(
	<Provider store={store}>
		<RouterProvider router={router} />
	</Provider>,
	document.getElementById("root")
);
