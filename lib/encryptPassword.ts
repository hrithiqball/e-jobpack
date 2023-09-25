import bcrypt from "bcrypt";

export async function encryptPassword(password: string): Promise<string> {
	try {
		const saltRounds = 10;
		const salt = await bcrypt.genSalt(saltRounds);
		const hashedPassword = await bcrypt.hash(password, salt);
		return hashedPassword;
	} catch (error) {
		console.error(error);
		throw new Error("Error encrypting password");
	}
}
