import { Asset } from "@/models/asset";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "GET") {
		res.setHeader("Allow", ["GET"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
		return;
	}

	try {
		console.log(req.query.id);
		// use this value to query and find the asset
		// if not found return error

		const asset: Asset = {
			uid: req.query.id as string,
			name: "Oil filter",
			type: "machine",
		};

		res.status(200).json({
			status: "OK",
			message: `Asset ${req.query.id} found`,
			data: asset,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
}
