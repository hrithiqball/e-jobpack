import { prisma } from "@/lib/initPrisma";
import { NextResponse } from "next/server";

export async function GET(
	request: Request,
	{ params }: { params: { uid: string } }
) {
	const uid = params.uid;
	const asset = await prisma.asset.findUnique({
		where: { uid },
	});

	if (asset) {
		let json_response = {
			status: "success",
			asset,
		};
		return new NextResponse(JSON.stringify(json_response), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} else {
		let error_response = {
			status: "fail",
			message: "No Asset with the Provided ID Found",
		};
		return new NextResponse(JSON.stringify(error_response), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}
}

// export default async function handler(
// 	req: NextApiRequest,
// 	res: NextApiResponse
// ) {
// 	if (req.method !== "GET") {
// 		res.setHeader("Allow", ["GET"]);
// 		res.status(405).end(`Method ${req.method} Not Allowed`);

// 		return;
// 	}

// 	const result = UidAsset.safeParse(req.query);

// 	if (result.success) {
// 		try {
// 			const asset: asset | null = await prisma.asset.findUnique({
// 				where: {
// 					uid: result.data.uid,
// 				},
// 			});

// 			if (asset) {
// 				const message = `Asset ${asset.uid} found`;
// 				console.info(message);
// 				res.status(200).json(ResponseMessage(200, message, asset));

// 				return;
// 			} else {
// 				const message = `Asset ${result.data.uid} not found`;
// 				console.error(message);
// 				res.status(404).json(ResponseMessage(404, message));

// 				return;
// 			}
// 		} catch (error: unknown) {
// 			if (error instanceof Error) {
// 				res.status(500).json(ResponseMessage(500, error.message));
// 			} else {
// 				res.status(500);
// 			}
// 		} finally {
// 			await prisma.$disconnect();
// 		}
// 	} else {
// 		res
// 			.status(400)
// 			.json(
// 				ResponseMessage(
// 					400,
// 					result.error.issues.map((issue) => issue.message).join(", "),
// 					null,
// 					result.error.issues.map((issue) => issue.code.toString()).join("")
// 				)
// 			);

// 		return;
// 	}
// }

export async function PATCH(
	request: Request,
	{ params }: { params: { uid: string } }
) {
	try {
		const uid = params.uid;
		let json = await request.json();

		const updatedAsset = await prisma.asset.update({
			where: { uid },
			data: json,
		});

		let json_response = {
			status: "success",
			updatedAsset,
		};

		return new NextResponse(JSON.stringify(json_response), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error: any) {
		if (error.code === "P2025") {
			let error_response = {
				status: "fail",
				message: "No Feedback with the Provided ID Found",
			};
			return new NextResponse(JSON.stringify(error_response), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			});
		}

		let error_response = {
			status: "error",
			message: error.message,
		};
		return new NextResponse(JSON.stringify(error_response), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}

// export default async function handler(
// 	req: NextApiRequest,
// 	res: NextApiResponse
// ) {
// 	if (req.method !== "PATCH") {
// 		res.setHeader("Allow", ["PATCH"]);
// 		res.status(405).end(`Method ${req.method} Not Allowed`);

// 		return;
// 	}

// 	const result = UpdateAssetSchema.safeParse(req.body);

// 	if (result.success) {
// 		try {
// 			const request: UpdateAsset = result.data as UpdateAsset;
// 			const target: asset = await prisma.asset.update({
// 				where: {
// 					uid: request.uid,
// 				},
// 				data: {
// 					...request,
// 					uid: undefined,
// 				},
// 			});

// 			res.status(200).json({
// 				status: "OK",
// 				message: `Asset ${target.uid} has been updated`,
// 				data: target,
// 			});
// 		} catch (error: unknown) {
// 			console.error(error);
// 			if (error instanceof Error) {
// 				res.status(500).json(ResponseMessage(500, error.message));
// 			}
// 		} finally {
// 			await prisma.$disconnect();
// 		}
// 	} else {
// 		res
// 			.status(400)
// 			.json(
// 				ResponseMessage(
// 					400,
// 					result.error.issues.map((issue) => issue.message).join(", "),
// 					null,
// 					result.error.issues.map((issue) => issue.code.toString()).join("")
// 				)
// 			);

// 		return;
// 	}
// }

export async function DELETE(
	request: Request,
	{ params }: { params: { uid: string } }
) {
	try {
		const uid = params.uid;
		await prisma.asset.delete({
			where: { uid },
		});

		return new NextResponse(null, { status: 204 });
	} catch (error: any) {
		if (error.code === "P2025") {
			let error_response = {
				status: "fail",
				message: "No Feedback with the Provided ID Found",
			};
			return new NextResponse(JSON.stringify(error_response), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			});
		}

		let error_response = {
			status: "error",
			message: error.message,
		};
		return new NextResponse(JSON.stringify(error_response), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}

// export default async function handler(
// 	req: NextApiRequest,
// 	res: NextApiResponse
// ) {
// 	if (req.method !== "DELETE") {
// 		res.setHeader("Allow", ["DELETE"]);
// 		res.status(405).end(`Method ${req.method} Not Allowed`);

// 		return;
// 	}

// 	const result = UidAsset.safeParse(req.body);

// 	if (result.success) {
// 		try {
// 			const asset: asset = await prisma.asset.delete({
// 				where: {
// 					uid: result.data.uid,
// 				},
// 			});

// 			if (asset) {
// 				const message = `Asset ${asset.uid} deleted`;
// 				console.info(message);
// 				res.status(200).json(ResponseMessage(200, message, asset));

// 				return;
// 			} else {
// 				const message = `Asset ${result.data.uid} not found`;
// 				console.error(message);
// 				res.status(404).json(ResponseMessage(404, message));

// 				return;
// 			}
// 		} catch (error: unknown) {
// 			console.error(error);
// 			if (error instanceof Error) {
// 				res.status(500).json(ResponseMessage(500, error.message));
// 			} else {
// 				res.status(500);
// 			}
// 		} finally {
// 			await prisma.$disconnect();
// 		}
// 	} else {
// 		res
// 			.status(400)
// 			.json(
// 				ResponseMessage(
// 					400,
// 					result.error.issues.map((issue) => issue.message).join(", "),
// 					null,
// 					result.error.issues.map((issue) => issue.code.toString()).join("")
// 				)
// 			);

// 		return;
// 	}
// }
