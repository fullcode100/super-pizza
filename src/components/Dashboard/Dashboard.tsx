import { useEffect, useState } from "react";
import { connect } from "react-redux";

import { isAdmin } from "src/js/Helpers";
import { State } from "src/interfaces/interfaces";
import Users from "./components/Users";
import Orders from "./components/Orders";
import Pizzas from "./components/Pizzas";
import Settings from "./components/Settings";
import MySpace from "./components/MySpace";

import "./Dashboard.scss";

const Dashboard = (props) => {
	const { user } = props;
	const [activeTab, setActiveTab] = useState("myspace");
	const { location } = props;
	const { pathname } = location;
	const updateUrlHashTab = (hash: string) => {
		props.history.push({ pathname, hash });
		setActiveTab(hash);
	};
	const activeClassTab = (hash: string, showClass: boolean = false): string => {
		return hash === activeTab ? `${showClass && "show"} active` : "";
	};
	const displayIfAdmin: boolean = user && isAdmin(user);

	useEffect(() => {
		const { hash } = location;
		const splitHash = hash.split("#");

		if (hash) setActiveTab(splitHash[1]);
		else updateUrlHashTab(activeTab);
	}, []);

	return (
		<div id="dashboard" className="container">
			<h3>Tableau de bord</h3>

			<ul className="nav nav-tabs" id="myTab" role="tablist">
				{user && (
					<li className="nav-item" role="presentation">
						<a
							onClick={() => updateUrlHashTab("myspace")}
							className={`nav-link ${activeClassTab("myspace")}`}
							id="myspace-tab"
							data-bs-toggle="tab"
							href="#myspace"
							role="tab"
							aria-controls="myspace"
							aria-selected="true">
							Mon espace
						</a>
					</li>
				)}
				<li className="nav-item" role="presentation">
					<a
						onClick={() => updateUrlHashTab("orders")}
						className={`nav-link ${activeClassTab("orders")}`}
						id="orders-tab"
						data-bs-toggle="tab"
						href="#orders"
						role="tab"
						aria-controls="orders"
						aria-selected="false">
						Commandes
					</a>
				</li>
				{displayIfAdmin && (
					<>
						<li className="nav-item" role="presentation">
							<a
								onClick={() => updateUrlHashTab("pizzas")}
								className={`nav-link ${activeClassTab("pizzas")}`}
								id="pizzas-tab"
								data-bs-toggle="tab"
								href="#pizzas"
								role="tab"
								aria-controls="pizzas"
								aria-selected="false">
								Pizzas
							</a>
						</li>
						<li className="nav-item" role="presentation">
							<a
								onClick={() => updateUrlHashTab("users")}
								className={`nav-link ${activeClassTab("users")}`}
								id="users-tab"
								data-bs-toggle="tab"
								href="#users"
								role="tab"
								aria-controls="users"
								aria-selected="false">
								Utilisateurs
							</a>
						</li>
						<li className="nav-item" role="presentation">
							<a
								onClick={() => updateUrlHashTab("settings")}
								className={`nav-link ${activeClassTab("settings")}`}
								id="settings-tab"
								data-bs-toggle="tab"
								href="#settings"
								role="tab"
								aria-controls="settings"
								aria-selected="false">
								Paramètres
							</a>
						</li>
					</>
				)}
			</ul>
			<div className="tab-content" id="myTabContent">
				{user && (
					<div className={`tab-pane fade ${activeClassTab("myspace", true)}`} id="myspace" role="tabpanel" aria-labelledby="myspace-tab">
						<MySpace />
					</div>
				)}
				<div className={`tab-pane fade ${activeClassTab("orders", true)}`} id="orders" role="tabpanel" aria-labelledby="orders-tab">
					<Orders />
				</div>
				{displayIfAdmin && (
					<>
						<div className={`tab-pane fade ${activeClassTab("pizzas", true)}`} id="pizzas" role="tabpanel" aria-labelledby="pizzas-tab">
							<Pizzas />
						</div>
						<div className={`tab-pane fade ${activeClassTab("users", true)}`} id="users" role="tabpanel" aria-labelledby="users-tab">
							<Users />
						</div>
						<div
							className={`tab-pane fade ${activeClassTab("settings", true)}`}
							id="settings"
							role="tabpanel"
							aria-labelledby="settings-tab">
							<Settings />
						</div>
					</>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = (state: State) => ({
	user: state.user,
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
