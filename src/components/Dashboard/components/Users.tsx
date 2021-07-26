import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import Swal from "sweetalert2";

import Modal from "src/components/Modal/Modal";
import Loading from "src/components/Loading/Loading";
import axiosInstance from "src/js/Axios";
import { getUsers, deleteUser, createUser, updateUser, updateLoading } from "src/actions";
import { formatDate, closeModal } from "src/js/Helpers";

import { IUser, State } from "src/interfaces/interfaces";

const Users = (props) => {
	const { loading, users } = props;
	const [currentUser, setCurrentUser] = useState<IUser>(null);
	const [create, setCreate] = useState<boolean>(true);
	const init = {
		username: "",
		email: "",
		role: "",
		password: "",
	};
	const [values, setValues] = useState(init);
	const dispatch = useDispatch();
	const handleUser = (user: IUser) => {
		setValues(user as IUser);
		setCreate(false);
		setCurrentUser(user);
	};
	const handleChange = (evt) => {
		const { value } = evt.target;
		const { name } = evt.target;

		setValues({ ...values, [name]: value });
	};
	const handleCreate = async () => {
		dispatch(updateLoading("users", true));

		const response = await axiosInstance().post("/users/create", { user: values });
		const { data } = response;
		const { message } = data;

		if (message === "User already exist") {
			return Swal.fire({
				title: "Erreur",
				text: "Cet utilisateur existe déjà.",
				icon: "error",
				confirmButtonText: "OK",
			});
		}
		setValues(init);
		dispatch(createUser(data.user));
		closeModal();
		return Swal.fire({
			title: "Succès",
			text: "L'utilisateur à bien été créée avec succès.",
			icon: "success",
			confirmButtonText: "OK",
		});
	};
	const handleUpdate = async () => {
		dispatch(updateLoading("users", true));

		const response = await axiosInstance().put(`/users/update/${currentUser._id}`, {
			role: values.role,
		});
		const { data } = response;
		const { message } = data;

		if (message === "User info updated") {
			dispatch(
				updateUser({
					...currentUser,
					role: values.role,
				})
			);
			Swal.fire({
				title: "Succès",
				text: "L'utilisateur à bien été modifiée avec succès.",
				icon: "success",
				confirmButtonText: "OK",
			}).then((res) => {
				if (res.isConfirmed) {
					closeModal();
					setValues({ role: "" } as IUser);
				}
			});
		}
	};
	const handleDelete = async (user: IUser) => {
		return Swal.fire({
			title: "Suppression",
			text: `Vous êtes sure de vouloir supprimer l'utilisateur ${user.username} ?`,
			icon: "warning",
			showCancelButton: true,
			showConfirmButton: true,
			cancelButtonText: "Annulez",
			confirmButtonText: "OK",
		}).then(async (result) => {
			if (result.isConfirmed) {
				dispatch(updateLoading("users", true));
				await axiosInstance()
					.delete(`/users/delete/${user._id}`)
					.then(() => {
						dispatch(deleteUser(user));
						return Swal.fire({
							title: "Succès",
							text: "L'utilisateur à bien été supprimer avec succès.",
							icon: "success",
							confirmButtonText: "OK",
						});
					});
			}
		});
	};

	useEffect(() => {
		dispatch(getUsers());
	}, []);

	if (loading) return <Loading />;

	return (
		<div className="container">
			<button
				data-bs-toggle="modal"
				onClick={() => {
					setCurrentUser(null);
					setCreate(true);
					setValues(init);
				}}
				data-bs-target="#userModal"
				type="button"
				className="btn btn-light">
				Créer
			</button>

			<hr />

			<div className="table-responsive">
				{users && users.length <= 0 ? (
					<div className="no-content">Aucun utilisateur enregistré</div>
				) : (
					<table className="table table-striped table-hover">
						<thead>
							<tr>
								<th>#</th>
								<th>Nom</th>
								<th>Email</th>
								<th>Role</th>
								<th>Date de création</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user: IUser, i) => {
								const isAdmin = user.role === "Administrateur";

								return (
									<tr key={user._id}>
										<td className="table-primary">
											<div>{i + 1}</div>
										</td>
										<td>
											<div>{user.username}</div>
										</td>
										<td>
											<div>{user.email}</div>
										</td>
										<td>
											<div className={`btn-${isAdmin ? "danger" : "primary"}`}>{user.role}</div>
										</td>
										<td>
											<div>{formatDate(user.created_at)}</div>
										</td>
										<td className="table-warning">
											<div className="btn-group" role="group" aria-label="Basic example">
												<button
													onClick={() => {
														handleUser(user);
													}}
													data-bs-toggle="modal"
													data-bs-target="#userModal"
													type="button"
													className="btn btn-secondary">
													Modifier
												</button>
												{!isAdmin && (
													<button type="button" onClick={() => handleDelete(user)} className="btn btn-danger">
														Supprimer
													</button>
												)}
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
				id="userModal"
				title={!create ? `Modifier l'utilisateur: ${currentUser.username}` : "Créer un utilisateur"}
				buttonName={!create ? "Modifier" : "Enregistrer"}
				handleValid={!create ? handleUpdate : handleCreate}>
				{!currentUser && (
					<>
						<div className="input-group mt-4 mb-4">
							<input
								value={values.username}
								onChange={handleChange}
								type="text"
								name="username"
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
								value={values.email}
								type="text"
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
					</>
				)}

				<div className="input-group mb-4">
					<label className="input-group-text" htmlFor="inputGroupSelect01">
						Rôle
						<span>
							&nbsp;<b>({!create && currentUser.role})</b>
						</span>
					</label>
					<select value={values.role} onChange={handleChange} name="role" className="form-select" id="inputGroupSelect01">
						<option>Choisir...</option>
						<option value="Administrateur">Administrateur</option>
						<option value="Utilisateur">Utilisateur</option>
					</select>
				</div>
			</Modal>
		</div>
	);
};

const mapStateToProps = (state: State) => ({
	loading: state.loading.users,
	users: state.users,
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
