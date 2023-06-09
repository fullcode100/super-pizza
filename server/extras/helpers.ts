import fs from "fs";
import nodePath from "path";
import bcrypt from "bcrypt";
import { Request } from "express";
import { UploadedFile } from "express-fileupload";

require("dotenv").config({ path: nodePath.join(__dirname, "/../.env") });

const dev = process.env["NODE_ENV"] === "development";

/**
 *
 * Générate Order Number
 */
export const orderNumber = (): string => {
	let now = Date.now().toString(); // '1492341545873'
	// pad with extra random digit
	now += now + Math.floor(Math.random() * 10);
	// format
	return [now.slice(0, 4), now.slice(4, 10), now.slice(10, 14)].join("-");
};

/**
 * Move Uploaded Image
 * @param req
 */
export const uploadImgPizza = (req: Request): string | undefined => {
	if (!req.files) return undefined;
	// Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
	const img = req.files.file as UploadedFile;
	const path = nodePath.resolve(__dirname, `../../public/uploads`);
	const filePath = `${path}/${img.name}`;

	try {
		if (!fs.existsSync(path)) fs.mkdirSync(path);
		img.mv(filePath);
		return `/uploads/${img.name}`;
	} catch (err) {
		console.error(err);
	}

	return undefined;
};

/**
 * Delete image
 * @param path
 */
export const deleteImg = (path: string | undefined): void => {
	if (!path) return;
	if (dev) fs.unlink(`./public${path}`, () => {});
	else fs.unlink(`.${path}`, () => {});
};

/**
 * Hash password
 * @param password
 * @param cb
 */
export const hashPass = (password: string, cb: Function) => {
	const saltRounds = 10;

	bcrypt.genSalt(saltRounds, (err, salt) => {
		bcrypt.hash(password, salt, (err, hash: string) => {
			cb(hash);
		});
	});
};

/**
 * Order Status Message
 */
export const orderStatusMessage = {
	waiting: "Votre commande est en attente de validation.",
	in_progress: "Votre commande à été prise en compte.",
	ready: "Votre commande est prête.",
};
