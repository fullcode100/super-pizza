import React from "react";
import { connect, useDispatch } from "react-redux";
import Swal from "sweetalert2";

import Modal from "src/components/Modal/Modal";
import axiosInstance from "src/js/Axios";
import { updateLoading, getSettings, updateSettings } from "src/actions";
import { settingsTrans, closeModal } from "src/js/Helpers";
import Loading from "src/components/Loading/Loading";

import { ISettings, State } from "src/interfaces/interfaces";

const Settings = (props) => {
	const { loading, settings, updateSettings, getSettings } = props;
	const [setting, setSetting] = React.useState({});
	const [values, setValues] = React.useState({});
	const [modal, setModal] = React.useState(false);
	const toggle = () => setModal(!modal);
	const handleSetting = (setting) => {
		setSetting(setting);
		setValues(setting);
	};
	const dispatch = useDispatch();
	const handleChange = (evt) => {
		const value = evt.target.value;
		const name = evt.target.name;

		setValues({ [name]: value });
	};
	const handleUpdate = async () => {
		dispatch(updateLoading("settings", true));

		const s = { ...setting, ...values };
		const response = await axiosInstance().put(`/settings/update/${s["_id"]}`, { setting: s });
		const data = response.data;
		const message = data.message;

		if (message === "Setting updated") {
			updateSettings(s);
			return Swal.fire({
				title: "Succès",
				text: "Les paramètres ont bien été modifiée avec succès.",
				icon: "success",
				confirmButtonText: "OK",
			}).then((res) => {
				if (res.isConfirmed) {
					closeModal();
					setValues({});
					setSetting({});
				}
			});
		}
	};

	React.useEffect(() => {
		getSettings();
	}, []);

	if (loading) return <Loading />;

	return (
		<div className="container">
			<div className="table-responsive">
				<table className="table table-striped table-hover">
					<thead>
						<tr>
							<th>#</th>
							<th>Nom</th>
							<th>Valeur</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{settings.map((s, i) => {
							const _id = s[Object.keys(s)[0]];
							const key = Object.keys(s)[1];
							const value = s[key];

							return (
								<tr key={i}>
									<td className="table-primary">
										<div>{i + 1}</div>
									</td>
									<td>
										<div>{settingsTrans[key]}</div>
									</td>
									<td>
										<div>{value}</div>
									</td>
									<td className="table-warning">
										<div className="btn-group" role="group" aria-label="Basic example">
											<button
												onClick={() => {
													handleSetting({ _id, name: key, [key]: value });
												}}
												data-bs-toggle="modal"
												data-bs-target="#settingsModal"
												type="button"
												className="btn btn-secondary">
												Modifier
											</button>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>

				<Modal id="settingsModal" title={"Modifier les paramètres"} buttonName={"Modifier"} handleValid={handleUpdate}>
					<div className="input-group mt-4 mb-4">
						<input
							value={values["order_capacity_by_hour"] || ""}
							onChange={handleChange}
							type="number"
							name="order_capacity_by_hour"
							aria-label="Capacité de commande par heure"
							placeholder="Capacité de commande par heure"
							className="form-control"
						/>
					</div>
				</Modal>
			</div>
		</div>
	);
};

const mapStateToProps = (state: State) => ({
	loading: state.loading.settings,
	settings: state.settings,
});
const mapDispatchToProps = { getSettings, updateLoading, updateSettings };

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
