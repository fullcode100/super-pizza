import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, connect } from "react-redux";

import Loading from "src/components/Loading/Loading";
import Dashboard from "src/components/Dashboard/Dashboard";
import Home from "src/components/Home/Home";
import Navbar from "src/components/Navbar/Navbar";

import { getCurrentUser } from "src/js/Helpers";
import { State } from "src/interfaces";
import { updateLoading } from "src/redux/actions";
import { login } from "src/redux/actions/auth";

function App(props: State) {
	const { loading } = props;
	const dispatch = useDispatch();

	useEffect(() => {
		const token = window.localStorage.getItem("token");

		if (token) dispatch(login(getCurrentUser(), false));

		setTimeout(() => {
			dispatch(updateLoading("app", false));

			const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
			const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));

			tooltipTriggerList.map(
				(tooltipTriggerEl) =>
					new (window as any).bootstrap.Tooltip(tooltipTriggerEl, {
						delay: { show: 200, hide: 100 },
					})
			);
			popoverTriggerList.map(
				(popoverTriggerEl) =>
					new (window as any).bootstrap.Popover(popoverTriggerEl, {
						delay: { show: 200, hide: 100 },
					})
			);
		}, 1500);
	}, []);

	if (loading.app) return <Loading />;

	return (
		<>
			<Navbar />

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/dashboard" element={<Dashboard />} />
			</Routes>
		</>
	);
}

const mapStateToProps = (state: State) => ({
	loading: state.loading.app,
	user: state.user,
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(App as any);
