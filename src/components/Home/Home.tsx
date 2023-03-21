import { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import Swal from "sweetalert2";

import Loading from "src/components/Loading/Loading";
import { getPizzas, addToCart } from "src/actions";
import { isConnected, truncate } from "src/js/Helpers";
import { IPizza, State } from "src/interfaces";

import "./Home.scss";
import { AnyAction } from "redux";

function Home(props) {
	const { loading, pizzas } = props;
	const dispatch = useDispatch();
	const handleClick = (pizza: IPizza) => {
		if (!isConnected()) {
			return Swal.fire({
				title: "Info",
				text: "Veuillez créer un compte ou vous connectez pour pouvoir passer commande.",
				icon: "info",
				confirmButtonText: "OK",
			});
		}

		return dispatch(addToCart(pizza) as unknown as AnyAction);
	};

	useEffect(() => {
		dispatch(getPizzas() as unknown as AnyAction);
	}, []);

	if (loading) return <Loading />;

	return (
		<div id="home" className="container">
			<h3>Pizzas </h3>

			<div className="row" id="pizzas-container">
				{pizzas.length <= 0 ? (
					<div className="no-content">Aucune pizza à afficher</div>
				) : (
					pizzas.map((pizza: IPizza) => (
						<div key={pizza._id} className="col-4">
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
													<b>Qty:</b>
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
					))
				)}
			</div>
		</div>
	);
}

const mapStateToProps = (state: State) => ({
	loading: state.loading.pizzas,
	pizzas: state.pizzas,
	cart: state.cart,
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
