import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import { postAssetReq } from "@/models/asset";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
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

			// save the asset (await)
			// if fail return error status

			res.status(200).json({
				status: "OK",
				message: `Asset ${request.uid} have been saved into database`,
				data: request,
			});
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
		return;
	}
}
