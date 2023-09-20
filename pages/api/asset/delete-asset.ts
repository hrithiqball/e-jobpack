import { Asset, uidAsset } from "@/models/asset";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "DELETE") {
		res.setHeader("Allow", ["DELETE"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
		return;
	}

	try {
		const { error, value: request } = uidAsset.validate(req.body);

		if (error) {
			res.status(400).json({
				error: error.details.map((detail) => detail.message).join(", "),
			});
		} else {
			// find the asset and delete it (await)

			// if fail error
			// if (!deletedAsset) {
			// 	res.status(404).json({ error: "Asset not found" });
			// 	return;
			// }

			const asset: Asset = {
				uid: request.uid,
				name: "Oil filter",
				type: "machine",
			};

			res.status(200).json({
				status: "OK",
				message: `Asset ${req.body.uid} has been deleted`,
				data: asset,
			});
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
}
