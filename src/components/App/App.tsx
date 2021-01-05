import React from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch, connect } from "react-redux";

import Navbar from "../Navbar/Navbar";
import Home from "../Home/Home";
import Footer from "../Footer/Footer";
import Loading from "src/components/Loading/Loading";
import Dashboard from "src/components/Dashboard/Dashboard";
import { login, updateLoading } from "src/actions";
import { getCurrentUser } from "src/js/Helpers";

import { State } from "src/interfaces/interfaces";

const App = (props) => {
	const { loading, updateLoading } = props;
	const dispatch = useDispatch();

	React.useEffect(() => {
		const token = window.localStorage.getItem("token");

		token && dispatch(login(getCurrentUser(), false));

		setTimeout(() => {
			dispatch(updateLoading("app", false));

			const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
			const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));

			tooltipTriggerList.map(function (tooltipTriggerEl) {
				return new (window as any).bootstrap.Tooltip(tooltipTriggerEl, {
					delay: { show: 200, hide: 100 },
				});
			});
			popoverTriggerList.map(function (popoverTriggerEl) {
				return new (window as any).bootstrap.Popover(popoverTriggerEl, {
					delay: { show: 200, hide: 100 },
				});
			});
		}, 1500);
	}, []);

	if (loading) return <Loading />;

	return (
		<>
			<Navbar />

			<Switch>
				<Route exact path={"/"} component={Home} />
				<Route path={"/dashboard"} component={(props) => <Dashboard {...props} />} />
			</Switch>

			<Footer />
		</>
	);
};

const mapStateToProps = (state: State) => ({
	loading: state.loading.app,
	user: state.user,
});
const mapDispatchToProps = { login, updateLoading };

export default connect(mapStateToProps, mapDispatchToProps)(App);
