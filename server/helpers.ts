import fs from "fs";
import bcrypt from "bcrypt";

const dev = process.env.NODE_ENV === "development";

export const orderNumber = (): string => {
	let now = Date.now().toString(); // '1492341545873'
	// pad with extra random digit
	now += now + Math.floor(Math.random() * 10);
	// format
	return [now.slice(0, 4), now.slice(4, 10), now.slice(10, 14)].join("-");
};

export const uploadImgPizza = (req, res, next?: () => void): string => {
	if (!req.files) return;
	// Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
	const img = req.files.file;
	const path = `/uploads/${img.name}`;
	// Use the mv() method to place the file in upload directory (i.e. "uploads")
	if (dev) img.mv(`./public${path}`);
	else img.mv(`.${path}`);

	return path;
};

export const deleteImg = (path: string): void => {
	if (dev) fs.unlink(`./public${path}`, () => {});
	else fs.unlink(`.${path}`, () => {});
};

export const hashPass = (password: string, cb: Function) => {
	const saltRounds = 10;

	bcrypt.genSalt(saltRounds, (err, salt) => {
		bcrypt.hash(password, salt, (err, hash: string) => {
			cb(hash);
		});
	});
};

export const orderStatusMessage = {
	waiting: "Votre commande est en attente de validation.",
	in_progress: "Votre commande à été prise en compte.",
	ready: "Votre commande est prête.",
};
