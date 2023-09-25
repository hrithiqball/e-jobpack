import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { AddUser, AddUserSchema } from "@/models/user";
import { encryptPassword } from "@/lib/encryptPassword";
import { supabase } from "@/lib/initSupabase";
import moment from "moment";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
		return;
	}

	const result = AddUserSchema.safeParse(req.body);

	if (!result.success) {
		res.status(400).json({
			status: "Bad Request",
			message: result.error.issues.map((issue) => issue.message).join(", "),
			hint: result.error.issues.map((issue) => issue.code),
		});
		return;
	}

	const prisma = new PrismaClient();

	try {
		const request: AddUser = {
			...result.data,
			uid: `USER-${moment().format("YYMMDDHHmmssSSS")}`,
			password: await encryptPassword(result.data.password),
			first_page: 0,
			enable_dashboard: false,
			is_dark_mode: false,
		};

		const target = await prisma.user.create({
			data: request,
		});

		const { error } = await supabase.auth.signUp({
			email: request.email,
			password: request.password,
			// phone: request.phone,
		});

		if (error) throw new Error(error.message);

		res.status(201).json({
			status: "Created",
			message: `Asset ${target.uid} has been saved into the database`,
			data: { uid: target.uid },
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "Internal server error", message: error });
	} finally {
		await prisma.$disconnect();
	}
}
