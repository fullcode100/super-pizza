import { IUser } from "src/interfaces/interfaces";

export const createUUID = () => {
	let dt = new Date().getTime();
	const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (dt + Math.random() * 16) % 16 | 0;
		dt = Math.floor(dt / 16);

		return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
	});

	return uuid;
};

export const closeModal = () => {
	const modalBackdrop = document.getElementsByClassName("modal-backdrop")[0];
	const closeBtn = document.querySelectorAll(".btn-close");

	document.body.classList.remove("modal-open");
	document.body.style.paddingRight = "initial";
	closeBtn.forEach((el, i) => {
		el && (el as HTMLElement).click();
		i >= closeBtn.length - 1 && modalBackdrop && modalBackdrop.remove();
	});
	closeBtn.length === 0 && modalBackdrop && modalBackdrop.remove();
};

export const getCurrentUser = (): IUser => {
	const user = JSON.parse(window.localStorage.getItem("user"));

	return user;
};

export const isConnected = (): boolean => {
	return getCurrentUser() != null;
};

const replace = (str: string) => str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");

export const truncate = (str: string, limit, after) => {
	let content: any = replace(str);
	content = content.split(" ").slice(0, limit);
	content = content.join(" ") + (after ? after : "");

	return content;
};

export const isAdmin = (user: IUser): boolean => {
	return user.role === "Administrateur";
};

export const orderStatusTrans = {
	waiting: "En attente.",
	in_progress: "En cours",
	ready: "Prête.",
	finish: "Finie.",
};

export const settingsTrans = {
	order_capacity_by_hour: "Capacité de commande par heure.",
};

export const formatDate = (dateStr: string) => {
	const date = new Date(dateStr);
	const monthNames = [
		"Janvier" /* "January" */,
		"Février" /* "February" */,
		"Mars" /* "March" */,
		"Avril" /* "April" */,
		"Mai" /* "May" */,
		"Juin" /* "June" */,
		"Juillet" /* "July" */,
		"Août" /* "August" */,
		"Septembre" /* "September" */,
		"Octobre" /* "October" */,
		"Novembre" /* "November" */,
		"Décembre" /* "December" */,
	];
	const d = date.getDate();
	const month = date.getMonth();
	const year = date.getFullYear();

	return `${d}-${monthNames[month]}-${year}`;
};
