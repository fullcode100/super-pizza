import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import Swal from "sweetalert2";

import Modal from "src/components/Modal/Modal";
import axiosInstance from "src/js/Axios";
import { closeModal } from "src/js/Helpers";
import Loading from "src/components/Loading/Loading";

import { IUser, State } from "src/interfaces";
import { updateLoading } from "src/redux/actions";
import { login } from "src/redux/actions/auth";

function MySpace(props) {
	const { loading, user } = props;
	const init = {
		username: "",
		email: "",
		password: "",
		role: "",
	};
	const [values, setValues] = useState(init);
	const dispatch = useDispatch();
	const handleUser = () => {
		setValues({
			username: user.username,
			email: user.email,
			role: user.role,
			password: "",
		} as IUser);
	};
	const handleChange = (evt) => {
		const { value } = evt.target;
		const { name } = evt.target;

		setValues({ ...values, [name]: value });
	};
	const handleUpdate = async () => {
		dispatch(updateLoading("users", true));

		const response = await axiosInstance().put(`/users/update/${user["_id"]}`, values);
		const { data } = response;
		const { message } = data;

		if (message === "User info updated") {
			dispatch(login(values));
			Swal.fire({
				title: "Succès",
				text: "Vos infos ont bien été modifiée avec succès.",
				icon: "success",
				confirmButtonText: "OK",
			}).then((res) => {
				if (res.isConfirmed) closeModal();
			});
		}
	};

	if (loading) return <Loading />;

	return (
		<div className="container">
			<div className="accordion" id="accordionExample">
				<div className="accordion-item">
					<h2 className="accordion-header" id="headingOne">
						<button
							className="accordion-button"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#collapseOne"
							aria-expanded="true"
							aria-controls="collapseOne">
							Infos
						</button>
					</h2>
					<div
						id="collapseOne"
						className="accordion-collapse collapse show"
						aria-labelledby="headingOne"
						data-bs-parent="#accordionExample">
						<div className="accordion-body">
							<div className="btn-group" role="group" aria-label="Basic example">
								<button
									data-bs-toggle="modal"
									data-bs-target="#userSpaceModal"
									type="button"
									onClick={() => handleUser()}
									className="btn btn-secondary">
									Modifier mes informations
								</button>
							</div>

							<hr />

							<table className="table table-striped table-hover">
								<thead>
									<tr>
										<th>Nom</th>
										<th>Email</th>
										<th>Role</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<div>{user.username}</div>
										</td>
										<td>
											<div>{user.email}</div>
										</td>
										<td>
											<div>{user.role}</div>
										</td>
									</tr>
								</tbody>
							</table>

							<Modal id="userSpaceModal" title="Modifier vos infos" buttonName="Modifier" handleValid={handleUpdate}>
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
							</Modal>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

const mapStateToProps = (state: State) => ({
	user: state.user,
	loading: state.loading.user,
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MySpace);
