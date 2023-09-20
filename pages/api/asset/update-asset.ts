import { NextApiRequest, NextApiResponse } from "next";
import { Asset, updateAssetReq } from "../../../models/asset";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "PUT" && req.method !== "PATCH") {
		res.setHeader("Allow", ["PUT", "PATCH"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
		return;
	}

	try {
		const { error, value: request } = updateAssetReq.validate(req.body);

		if (error) {
			res.status(400).json({
				error: error.details.map((detail) => detail.message).join(", "),
			});
		} else {
			const updatedAsset: Asset = {
				uid: request.uid,
				name: request.name ?? "Oil filter",
				type: request.type ?? "machine",
				description: request.description ?? "Oil filter for machine",
			};

			if (!updatedAsset) {
				res.status(404).json({ error: "Asset not found" });
				return;
			}

			res.status(200).json({
				status: "OK",
				message: `Asset ${updatedAsset.uid} updated successfully`,
				data: updatedAsset,
			});
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
}
