import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import Swal from "sweetalert2";

import axiosInstance from "../../js/Axios";
import Modal from "../Modal/Modal";
import { login, clearCart, logout, removeFromCart } from "src/actions";
import { closeModal } from "src/js/Helpers";

import { IUser, IPizza, State } from "src/interfaces/interfaces";

import "./Navbar.scss";

const Navbar = (props) => {
	const { user, cart, login, removeFromCart, clearCart, logout } = props;
	const [isLogin, setIsLogin] = React.useState(false);
	const [values, setValues] = React.useState({
		username: "",
		email: "",
		password: "",
	} as any);
	const handleChange = (evt) => {
		const value = evt.target.value;
		const name = evt.target.name;

		setValues({ ...values, [name]: value });
	};
	const handleSubmit = async () => {
		const path = isLogin ? "/login" : "/registration";
		const response = await axiosInstance().post(path, {
			user: { ...values, role: "Utilisateur" },
		});
		const data = response.data;

		if (!isLogin) {
			const message = data.message;

			if (message === "User already exist") {
				return Swal.fire({
					title: "Erreur",
					text: "Cet utilisateur existe déjà.",
					icon: "error",
					confirmButtonText: "OK",
				});
			} else {
				setValues({
					username: "",
					email: "",
					password: "",
				});
				closeModal();
				return Swal.fire({
					title: "Succès",
					text: "Votre inscription a été effectuée avec succès. Vous pouvez vous connecter.",
					icon: "success",
					confirmButtonText: "OK",
				});
			}
		} else {
			const message = data.message;
			const token: string = data.token;
			const user: IUser = data.user;

			if (message !== "User logged in") {
				return Swal.fire({
					title: "Erreur",
					text: "Vos identifiants ne sont pas corrects.",
					icon: "error",
					confirmButtonText: "OK",
				});
			}
			window.localStorage.setItem("token", token);
			window.localStorage.setItem("user", JSON.stringify(user));
			login(user);
			closeModal();
		}
	};
	const total = cart.reduce((n, { price }) => n + price, "");
	const handleOrder = async () => {
		const pizzasIds = cart.map((c: IPizza) => c._id);
		const response = await axiosInstance().post("/orders/create", {
			pizzasIds,
			userId: user._id,
		});
		const data = response.data;
		const message = data.message;

		if (message === "Order waiting") {
			return Swal.fire({
				title: "En attente",
				text: "Votre commande à été mise en attente. Vous serez notifiez par mail dès sa prise en charge.",
				icon: "warning",
				confirmButtonText: "OK",
			});
		} else if (message === "Order in progress") {
			return Swal.fire({
				title: "En cours de traitement",
				text: "Votre commande à été prise en compte. Vous serez notifiez par mail dès qu'elle est prête.",
				icon: "success",
				confirmButtonText: "OK",
			});
		}

		clearCart();
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
			<div className="container-fluid">
				<a className="navbar-brand" href="#">
					SUPERPIZZA
				</a>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						<li className="nav-item">
							<NavLink exact to="/" title="Accueil" className="nav-link">
								Accueil
							</NavLink>
						</li>
						{user && (
							<li className="nav-item">
								<NavLink to="/dashboard" title="Tableau de bord" className="nav-link">
									Tableau de bord
								</NavLink>
							</li>
						)}
						<li className="nav-item">
							<NavLink exact to="/use-case" title="Accueil" className="nav-link">
								Cas d'utilisation
							</NavLink>
						</li>
					</ul>

					<ul className="navbar-nav ml-auto">
						{!user ? (
							<>
								<li className="nav-item">
									<a className="nav-link" onClick={() => setIsLogin(true)} data-bs-toggle="modal" data-bs-target="#loginModal">
										Connexion
									</a>

									<Modal id="loginModal" title="Connexion" buttonName="Se connecter" handleValid={handleSubmit}>
										<div className="input-group mb-4">
											<span className="input-group-text" id="basic-addon1">
												@
											</span>
											<input onChange={handleChange} name="email" type="text" className="form-control" placeholder="Email" />
										</div>

										<div className="input-group mb-4">
											<input
												onChange={handleChange}
												name="password"
												type="password"
												className="form-control"
												placeholder="Mot de passe"
											/>
										</div>
									</Modal>
								</li>
								<li className="nav-item">
									<a
										className="nav-link"
										onClick={() => setIsLogin(false)}
										data-bs-toggle="modal"
										data-bs-target="#registrationModal">
										Inscription
									</a>

									<Modal
										id="registrationModal"
										title="Inscription"
										buttonName="Créer mon compte"
										handleValid={() => handleSubmit()}>
										<div className="input-group mt-4 mb-4">
											<input
												onChange={handleChange}
												type="text"
												name="username"
												value={values.username}
												aria-label="Nom"
												placeholder="Nom"
												className="form-control"
											/>
										</div>

										<div className="input-group mb-4">
											<span className="input-group-text" id="basic-addon1">
												@
											</span>
											<input
												onChange={handleChange}
												name="email"
												type="text"
												value={values.email}
												className="form-control"
												placeholder="Email"
												aria-label="Email address"
												aria-describedby="basic-addon1"
											/>
										</div>

										<div className="input-group mb-4">
											<input
												onChange={handleChange}
												value={values.password}
												name="password"
												type="password"
												className="form-control"
												placeholder="Mot de passe"
											/>
										</div>
									</Modal>
								</li>
							</>
						) : (
							<>
								<li className="nav-item dropdown">
									<a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">
										Panier{" "}
										<span className={`badge rounded-pill bg-${cart.length > 0 ? "danger" : "secondary"}`}>{cart.length}</span>
									</a>
									<ul className="dropdown-menu">
										{cart.length > 0 ? (
											cart.map((c, i) => {
												return (
													<li key={i}>
														<a className="dropdown-item disabled">
															{c.name} - {c.price}€
														</a>
														<a onClick={() => removeFromCart(c)} className="btn dropdown-item">
															<b>Retirer du panier</b>
														</a>
														{cart.length - 1 !== i && <hr />}
													</li>
												);
											})
										) : (
											<li>
												<a className="dropdown-item disabled">Votre panier est vide.</a>
											</li>
										)}
										{cart.length > 0 && (
											<>
												<li>
													<hr className="dropdown-divider" />
												</li>
												<li>
													<a onClick={handleOrder} className="btn dropdown-item">
														<b>Validez le panier</b>
													</a>
													<a onClick={clearCart} className="dropdown-item disabled">
														<b>Total: {total}€</b>
													</a>
												</li>
											</>
										)}
									</ul>
								</li>
								<li className="nav-item">
									<a className="nav-link" onClick={logout}>
										Deconnexion
									</a>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
};

const mapStateToProps = (state: State) => ({
	user: state.user,
	cart: state.cart,
});
const mapDispatchToProps = { login, logout, clearCart, removeFromCart };

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
