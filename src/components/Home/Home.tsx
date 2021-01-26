import React from "react";
import { connect } from "react-redux";
import Swal from "sweetalert2";

import Loading from "src/components/Loading/Loading";
import { getPizzas, addToCart } from "src/actions";
import { isConnected, truncate } from "src/js/Helpers";
import { IPizza, State } from "src/interfaces/interfaces";

import "./Home.scss";

const Home = (props) => {
	const { loading, pizzas, getPizzas, addToCart } = props;
	const handleClick = (pizza: IPizza) => {
		if (!isConnected()) {
			return Swal.fire({
				title: "Info",
				text: "Veuillez créer un compte ou vous connectez pour pouvoir passer commande.",
				icon: "info",
				confirmButtonText: "OK",
			});
		} else {
			addToCart(pizza);
		}
	};

	React.useEffect(() => {
		getPizzas();
	}, []);

	if (loading) return <Loading />;

	return (
		<div id="home" className="container">
			<h3>Liste des pizzas </h3>

			<div className="row" id="pizzas-container">
				{pizzas.map((pizza: IPizza, i: number) => {
					return (
						<div key={i} className="col-4">
							<div className="card" style={{ width: "18rem" }}>
								<img src={pizza.img_path} className="card-img-top" alt={pizza.name} />
								<div className="card-body">
									<h5 className="card-title">Pizza: {pizza.name}</h5>
									<p className="card-text">
										<span data-bs-toggle="tooltip" data-bs-placement="top" title={pizza.description}>
											{truncate(pizza.description, 10, "...")}
										</span>
									</p>

									<hr />

									<table>
										<tbody>
											<tr>
												<td>
													<>
														<b>Qty:</b>
													</>
												</td>
												<td> {pizza.qty} </td>
											</tr>
										</tbody>
									</table>

									{isConnected() ? (
										<a
											onClick={() => handleClick(pizza)}
											data-bs-toggle="popover"
											title="Panier"
											data-bs-content={`${pizza.name} à été ajoutée au panier !`}
											data-bs-placement="top"
											tabIndex={0}
											data-bs-trigger="focus"
											className="btn btn-success">
											Ajouter au panier
										</a>
									) : (
										<a onClick={() => handleClick(pizza)} className="btn btn-success">
											Ajouter au panier
										</a>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const mapStateToProps = (state: State) => ({
	loading: state.loading.pizzas,
	pizzas: state.pizzas,
	cart: state.cart,
});
const mapDispatchToProps = { getPizzas, addToCart };

export default connect(mapStateToProps, mapDispatchToProps)(Home);
