import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/initSupabase";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "GET") {
		res.setHeader("Allow", ["GET"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
		return;
	}

	console.log(req.query.uid);

	try {
		const { data, error } = await supabase
			.from("user")
			.select("*")
			.eq("uid", req.query.uid)
			.single();

		console.log(data);

		if (error) {
			throw new Error(error.message);
		}

		res.status(200).json({
			status: "OK",
			message: `User ${data.uid} found`,
			data: data,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "Internal server error", error: error });
	}
}
