import { useState } from "react";
import Swal from "sweetalert2";

import { closeModal } from "src/js/Helpers";
import Modal from "src/components/Modal/Modal";
import axiosInstance from "src/js/Axios";

/**
 * WARN: Créer avec pour seul but de pouvoir créer un administrateur lors d'une première installation
 * WARN: Dans la vraie vie, cela se fera autrement.
 */
function AddAdmin() {
	const [values, setValues] = useState({
		username: "",
		email: "",
		password: "",
	} as any);
	const handleChange = (evt) => {
		const { value } = evt.target;
		const { name } = evt.target;

		setValues({ ...values, [name]: value });
	};
	const handleSubmit = async () => {
		const path = "/admins/create";
		const response = await axiosInstance().post(path, {
			user: values,
		});
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

		setValues({ username: "", email: "", password: "" });
		closeModal();

		return Swal.fire({
			title: "Succès",
			text: "Administrateur crée avec succès.",
			icon: "success",
			confirmButtonText: "OK",
		});
	};

	return (
		<li className="nav-item">
			<a className="nav-link" data-bs-toggle="modal" data-bs-target="#adminModal">
				Test: Créer un admin
			</a>

			<Modal id="adminModal" title="Créer un administrateur" buttonName="Créer" handleValid={handleSubmit}>
				<div className="input-group mb-4">
					<input onChange={handleChange} name="username" type="text" className="form-control" placeholder="Nom" />
				</div>

				<div className="input-group mb-4">
					<span className="input-group-text" id="basic-addon1">
						@
					</span>
					<input onChange={handleChange} name="email" type="text" className="form-control" placeholder="Email" />
				</div>

				<div className="input-group mb-4">
					<input onChange={handleChange} name="password" type="password" className="form-control" placeholder="Mot de passe" />
				</div>
			</Modal>
		</li>
	);
}

export default AddAdmin;
