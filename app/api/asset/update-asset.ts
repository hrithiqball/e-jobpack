import { NextApiRequest, NextApiResponse } from "next";
import { Asset, updateAssetReq } from "../../../models/asset";
import { supabase } from "@/lib/initSupabase";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "PUT" && req.method !== "PATCH") {
		res.setHeader("Allow", ["PUT", "PATCH"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
		return;
	}

	try {
		const { error, value: request } = updateAssetReq.validate(req.body);

		console.log(request);
		if (error) {
			res.status(400).json({
				error: error.details.map((detail) => detail.message).join(", "),
			});
		} else {
			const updatedAsset: Partial<Asset> = {
				uid: request.uid,
			};

			if (request.name !== undefined) {
				updatedAsset.name = request.name;
			}
			if (request.description !== undefined) {
				updatedAsset.description = request.description;
			}
			if (request.type !== undefined) {
				updatedAsset.type = request.type;
			}

			console.log(updatedAsset);
			const { data, error } = await supabase
				.from("asset")
				.update([updatedAsset])
				.eq("uid", request.uid)
				.single();

			console.log(data, error);
			if (error) {
				res.status(500).json({
					code: error.code,
					error: "Internal server error",
					message: error.message,
				});
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
