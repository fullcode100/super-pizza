import { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch, connect } from "react-redux";

import Loading from "src/components/Loading/Loading";
import Dashboard from "src/components/Dashboard/Dashboard";
import UseCase from "src/components/UseCase/UseCase";
import Footer from "src/components/Footer/Footer";
import Home from "src/components/Home/Home";
import Navbar from "src/components/Navbar/Navbar";

import { login, updateLoading } from "src/actions";
import { getCurrentUser } from "src/js/Helpers";
import { State } from "src/interfaces/interfaces";

const App = (props: State) => {
	const { loading } = props;
	const dispatch = useDispatch();

	useEffect(() => {
		const token = window.localStorage.getItem("token");

		if (token) dispatch(login(getCurrentUser(), false));

		setTimeout(() => {
			dispatch(updateLoading("app", false));

			const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
			const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));

			tooltipTriggerList.map((tooltipTriggerEl) => {
				return new (window as any).bootstrap.Tooltip(tooltipTriggerEl, {
					delay: { show: 200, hide: 100 },
				});
			});
			popoverTriggerList.map((popoverTriggerEl) => {
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

			<div className="container mt-4">
				<div className="alert alert-info text-center" role="alert">
					Ce projet est plus axé sur la partie serveur (NodeJS). Cette interface permet de tester et interagir avec notre API. Les (fakes)
					données sont enregistrées dans une base de données Mongodb.
				</div>
			</div>

			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/dashboard" component={(routeProps) => <Dashboard {...routeProps} />} />
				<Route path="/use-case" component={(routeProps) => <UseCase {...routeProps} />} />
			</Switch>

			<Footer />
		</>
	);
};

const mapStateToProps = (state: State) => ({
	loading: state.loading.app,
	user: state.user,
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(App);
