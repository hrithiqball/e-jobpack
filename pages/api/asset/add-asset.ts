import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import { postAssetReq } from "@/models/asset";
import { supabase } from "@/lib/initSupabase";

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
		const { error, value: request } = postAssetReq.validate(req.body);

		if (error) {
			res.status(400).json({
				error: error.details.map((detail) => detail.message).join(", "),
			});
		} else {
			request.uid = `ASSET-${moment().format("YYMMDDHHmmssSSS")}`;
			const { error } = await supabase.from("asset").insert([request]).single();
			if (error) {
				res.status(500).json({
					message: error.message,
					details: error.details,
					hint: error.hint,
					code: error.code,
				});
				return;
			}

			res.status(201).json({
				status: "Created",
				message: `Asset ${request.uid} have been saved into database`,
				data: request,
			});
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ code: 500, error: "Internal server error" });
	}
}
