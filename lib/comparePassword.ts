import bcrypt from "bcrypt";

export async function comparePassword(
	plainPassword: string,
	hashedPassword: string
): Promise<boolean> {
	try {
		const match = await bcrypt.compare(plainPassword, hashedPassword);
		return match;
	} catch (error) {
		console.error(error);
		throw new Error("Error comparing password");
	}
}
