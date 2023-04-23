import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import Swal from "sweetalert2";

import Modal from "src/components/Modal/Modal";
import axiosInstance from "src/js/Axios";
import { settingsTrans, closeModal } from "src/js/Helpers";
import Loading from "src/components/Loading/Loading";

import { State } from "src/interfaces";
import { AnyAction } from "redux";
import { updateLoading } from "src/redux/actions";
import { getSettings, updateSettings } from "src/redux/actions/settings";

function Settings(props: any) {
	const { loading, settings } = props as State;
	const [setting, setSetting] = useState({});
	const [values, setValues] = useState({});
	const handleSetting = (s: {}) => {
		setSetting(s);
		setValues(s);
	};
	const dispatch = useDispatch();
	const handleChange = (evt) => {
		const { value } = evt.target;
		const { name } = evt.target;

		setValues({ [name]: value });
	};
	const handleUpdate = async () => {
		dispatch(updateLoading("settings", true));

		const s = { ...setting, ...values };
		const response = await axiosInstance().put(`/settings/update/${s["_id"]}`, { setting: s });
		const { data } = response;
		const { message } = data;

		if (message === "Setting updated") {
			dispatch(updateSettings(s));
			Swal.fire({
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

	useEffect(() => {
		dispatch(getSettings() as unknown as AnyAction);
	}, []);

	if (loading.settings) return <Loading />;

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
						{settings.map((_setting, i) => {
							const _id = _setting[Object.keys(_setting)[0]];
							const key = Object.keys(_setting)[1];
							const value = _setting[key];

							return (
								<tr key={_id}>
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

				<Modal id="settingsModal" title="Modifier les paramètres" buttonName="Modifier" handleValid={handleUpdate}>
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
}

const mapStateToProps = (state: State) => ({
	loading: state.loading,
	settings: state.settings,
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
