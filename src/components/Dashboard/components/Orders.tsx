import React from "react";
import { connect, useDispatch } from "react-redux";
import Swal from "sweetalert2";

import Modal from "src/components/Modal/Modal";
import Loading from "src/components/Loading/Loading";
import axiosInstance from "src/js/Axios";
import { getOrders, deleteOrder, updateOrder, updateLoading } from "src/actions";
import { getCurrentUser, truncate, formatDate, closeModal, orderStatusTrans, isAdmin } from "src/js/Helpers";

import { State, IOrder } from "src/interfaces/interfaces";

const Orders = (props) => {
	const { loading, orders, user, updateOrder, getOrders } = props;
	const [values, setValues] = React.useState({ status: "" });
	const [currentOrder, setCurrentOrder] = React.useState(null);
	const dispatch = useDispatch();
	const handleOrder = (order: IOrder) => {
		setValues(order);
		setCurrentOrder(order);
	};
	const handleChange = (evt) => {
		const value = evt.target.value;

		setValues({ status: value });
	};
	const handleUpdate = async () => {
		dispatch(updateLoading("orders", true));

		const response = await axiosInstance().put(`/orders/update/${currentOrder._id}`, {
			...currentOrder,
			status: values.status,
		});
		const data = response.data;
		const message = data.message;

		if (message === "Order info updated") {
			updateOrder({
				...currentOrder,
				status: values.status,
			});
			closeModal();
			return Swal.fire({
				title: "Succès",
				text: "Le status de la commande à bien été modifiée avec succès.",
				icon: "success",
				confirmButtonText: "OK",
			}).then((res) => {
				if (res.isConfirmed) setValues({ status: "" });
			});
		}
	};
	const displayIfAdmin: boolean = user && isAdmin(user);

	React.useEffect(() => {
		getOrders(getCurrentUser());
	}, []);

	if (loading) return <Loading />;

	return (
		<div className="container">
			<div className="table-responsive">
				{orders.length <= 0 ? (
					<div className="no-content">Aucune commande enregistrée</div>
				) : (
					<table className="table table-striped table-hover">
						<thead>
							<tr>
								<th>#</th>
								<th>N° Commande</th>
								<th>Status</th>
								<th>Utilisateur</th>
								<th>Pizzas</th>
								<th>Date de création</th>
								{displayIfAdmin && <th>Actions</th>}
							</tr>
						</thead>
						<tbody>
							{orders.map((order: IOrder, i) => {
								const names = order.pizzas.map((op) => op["name"]) + ", ";

								return (
									<tr key={i}>
										<td className="table-primary">
											<div>{i + 1}</div>
										</td>
										<td>
											<div>{order.n_order}</div>
										</td>
										<td>
											<div className={`btn-${order.status === "waiting" ? "primary" : "success"}`}>
												{orderStatusTrans[order.status]}
											</div>
										</td>
										<td>
											<div>{order.user["username"]}</div>
										</td>
										<td>
											<div data-bs-toggle="tooltip" data-bs-placement="top" title={names}>
												{truncate(names, 5, "...")}
											</div>
										</td>
										<td>
											<div>{formatDate(order.created_at)}</div>
										</td>
										{displayIfAdmin && (
											<td className="table-warning">
												<div className="btn-group" role="group" aria-label="Basic example">
													<button
														onClick={() => {
															handleOrder(order);
														}}
														data-bs-toggle="modal"
														data-bs-target="#orderModal"
														type="button"
														className="btn btn-secondary">
														Modifier
													</button>
												</div>
											</td>
										)}
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>

			<Modal id="orderModal" title={`Modifier le status`} buttonName="Modifier" handleValid={handleUpdate}>
				<div className="input-group mb-4">
					<label className="input-group-text" htmlFor="inputGroupSelect01">
						Status
						<span>
							&nbsp;<b>({values.status})</b>
						</span>
					</label>
					<select value={values.status} onChange={handleChange} name="role" className="form-select" id="inputGroupSelect01">
						<option>Choisir...</option>
						<option value="waiting">{orderStatusTrans["waiting"]}</option>
						<option value="in_progress">{orderStatusTrans["in_progress"]}</option>
						<option value="ready">{orderStatusTrans["ready"]}</option>
						<option value="finish">{orderStatusTrans["finish"]}</option>
					</select>
				</div>
			</Modal>
		</div>
	);
};

const mapStateToProps = (state: State) => ({
	loading: state.loading.orders,
	orders: state.orders,
	user: state.user,
});
const mapDispatchToProps = { getOrders, deleteOrder, updateOrder, updateLoading };

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
