import React from "react";
import { connect, useDispatch } from "react-redux";
import Swal from "sweetalert2";

import Modal from "src/components/Modal/Modal";
import Loading from "src/components/Loading/Loading";
import axiosInstance from "src/js/Axios";
import { getPizzas, deletePizza, createPizza, updatePizza, updateLoading } from "src/actions";
import { formatDate, closeModal, truncate } from "src/js/Helpers";

import { IPizza, State } from "src/interfaces/interfaces";

const Pizzas = (props) => {
	const { loading, pizzas, deletePizza, updatePizza, createPizza, getPizzas } = props;
	const [create, setCreate] = React.useState<boolean>(true);
	const init = {
		name: "",
		description: "",
		price: "",
		qty: 0,
		img: null,
	};
	const [currentPizza, setCurrentPizza] = React.useState(null);
	const [values, setValues] = React.useState(init);
	const dispatch = useDispatch();
	const handlePizza = (pizza: IPizza) => {
		setValues(pizza as any);
		setCreate(false);
		setCurrentPizza(pizza);
	};
	const handleChange = (evt) => {
		const value = evt.target.value;
		const name = evt.target.name;

		setValues({ ...values, [name]: value });
	};
	const handleChangeFile = (evt) => {
		const img = evt.target.files[0];

		setValues({ ...values, img });
	};
	const dataForm = new FormData();
	const handleCreate = async () => {
		dispatch(updateLoading("pizzas", true));
		appendForm();

		const response = await axiosInstance({
			headers: {
				accept: "application/json",
				"Content-Type": `multipart/form-data; boundary=${(dataForm as any)._boundary}`,
			},
		}).post("/pizzas/create", dataForm);
		const data = response.data;
		const message = data.message;

		if (message === "Pizza already exist") {
			return Swal.fire({
				title: "Erreur",
				text: "Cette pizza existe déjà.",
				icon: "error",
				confirmButtonText: "OK",
			});
		} else {
			setValues(init);
			createPizza(data.pizza);
			closeModal();
			return Swal.fire({
				title: "Succès",
				text: "La pizza à bien été créée avec succès.",
				icon: "success",
				confirmButtonText: "OK",
			});
		}
	};
	const appendForm = () => {
		const { img, name, price, qty, description } = values;

		img && dataForm.append("file", img, img.fileName);
		name && dataForm.set("name", name);
		price && dataForm.set("price", price);
		description && dataForm.set("description", description);
		qty && dataForm.set("qty", qty + "");
		!create && dataForm.set("oldImgPath", currentPizza.img_path);
	};
	const handleUpdate = async () => {
		dispatch(updateLoading("pizzas", true));
		appendForm();

		const response = await axiosInstance({
			headers: {
				accept: "application/json",
				"Content-Type": `multipart/form-data; boundary=${(dataForm as any)._boundary}`,
			},
		}).put(`/pizzas/update/${currentPizza._id}`, dataForm);
		const data = response.data;
		const message = data.message;

		if (message === "Pizza info updated") {
			updatePizza({
				...currentPizza,
				...values,
				...data.pizza,
			});
			return Swal.fire({
				title: "Succès",
				text: "La pizza à bien été modifiée avec succès.",
				icon: "success",
				confirmButtonText: "OK",
			}).then((res) => {
				if (res.isConfirmed) {
					closeModal();
					setValues(init);
				}
			});
		}
	};
	const handleDelete = async (pizza: IPizza) => {
		dispatch(updateLoading("pizzas", true));
		return Swal.fire({
			title: "Suppression",
			text: `Vous êtes sure de vouloir supprimer la pizza ${pizza.name} ?`,
			icon: "warning",
			showCancelButton: true,
			showConfirmButton: true,
			cancelButtonText: "Annulez",
			confirmButtonText: "OK",
		}).then(async (result) => {
			if (result.isConfirmed) {
				await axiosInstance()
					.delete(`/pizzas/delete/${pizza._id}`)
					.then(() => {
						deletePizza(pizza);
						return Swal.fire({
							title: "Succès",
							text: "La pizza à bien été supprimée avec succès.",
							icon: "success",
							confirmButtonText: "OK",
						});
					});
			}
		});
	};

	React.useEffect(() => {
		getPizzas();
	}, []);

	if (loading) return <Loading />;

	return (
		<div className="container">
			<button
				data-bs-toggle="modal"
				onClick={() => {
					setCurrentPizza(null);
					setCreate(true);
					setValues(init);
				}}
				data-bs-target="#pizzaModal"
				type="button"
				className="btn btn-light">
				Créer
			</button>

			<hr />

			<div className="table-responsive">
				{pizzas.length <= 0 ? (
					<div className="no-content">Aucune pizza enregistrée</div>
				) : (
					<table className="table table-striped table-hover">
						<thead>
							<tr>
								<th>#</th>
								<th>Nom</th>
								<th>Prix</th>
								<th>Qty</th>
								<th>Description</th>
								<th>Image</th>
								<th>Date de création</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{pizzas.map((pizza: IPizza, i) => {
								return (
									<tr key={i}>
										<td className="table-primary">
											<div>{i + 1}</div>
										</td>
										<td>
											<div>{pizza.name}</div>
										</td>
										<td>
											<div>{pizza.price}</div>
										</td>
										<td>
											<div>{pizza.qty}</div>
										</td>
										<td>
											<div data-bs-toggle="tooltip" data-bs-placement="top" title={pizza.description}>
												{truncate(pizza.description, 5, "...")}
											</div>
										</td>
										<td>
											<div>
												<img src={pizza.img_path} alt={pizza.name} width="90" />
											</div>
										</td>
										<td>
											<div>{formatDate(pizza.created_at)}</div>
										</td>
										<td className="table-warning">
											<div className="btn-group" role="group" aria-label="Basic example">
												<button
													onClick={() => {
														handlePizza(pizza);
													}}
													data-bs-toggle="modal"
													data-bs-target="#pizzaModal"
													type="button"
													className="btn btn-secondary">
													Modifier
												</button>
												<button type="button" onClick={() => handleDelete(pizza)} className="btn btn-danger">
													Supprimer
												</button>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>

			<Modal
				id="pizzaModal"
				title={!create ? `Modifier la pizza: ${currentPizza.name}` : "Créer une pizza"}
				buttonName={!create ? "Modifier" : "Enregistrer"}
				handleValid={!create ? handleUpdate : handleCreate}>
				<div className="input-group mt-4 mb-4">
					<input
						value={values.name}
						onChange={handleChange}
						type="text"
						name="name"
						aria-label="Nom"
						placeholder="Nom"
						className="form-control"
					/>
				</div>

				<div className="form-floating mt-4 mb-4">
					<textarea
						onChange={handleChange}
						name="description"
						value={values.description}
						className="form-control"
						placeholder="Leave a comment here"
						id="floatingTextarea"></textarea>
					<label htmlFor="floatingTextarea">Description</label>
				</div>

				<div className="input-group mt-4 mb-4">
					<span className="input-group-text">Prix / Qty</span>
					<input
						onChange={handleChange}
						name="price"
						value={values.price}
						type="number"
						placeholder="Prix"
						aria-label="First name"
						className="form-control"
					/>
					<input
						onChange={handleChange}
						name="qty"
						value={values.qty}
						placeholder="Quantité"
						type="number"
						aria-label="Last name"
						className="form-control"
					/>
				</div>

				<div>
					<label htmlFor="formFileLg" className="form-label">
						{create ? "Selectionner l'image de la pizza" : "Modifier l'image de la pizza"}
					</label>
					<input onChange={handleChangeFile} className="form-control form-control-lg" name="img" id="formFileLg" type="file" />
				</div>
			</Modal>
		</div>
	);
};

const mapStateToProps = (state: State) => ({
	loading: state.loading.pizzas,
	pizzas: state.pizzas,
});
const mapDispatchToProps = { createPizza, getPizzas, deletePizza, updatePizza, updateLoading };

export default connect(mapStateToProps, mapDispatchToProps)(Pizzas);
