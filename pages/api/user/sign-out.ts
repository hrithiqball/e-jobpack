import { supabase } from "@/lib/initSupabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);

		return;
	}

	try {
		const { error } = await supabase.auth.signOut();

		if (error) {
			throw new Error(error.message);
		}

		res.status(200).json({
			status: "OK",
			message: "User has been signed out",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "Internal server error", message: error });
	}
}
