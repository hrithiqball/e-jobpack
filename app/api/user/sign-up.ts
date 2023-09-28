import { NextApiRequest, NextApiResponse } from "next";
import { user } from "@prisma/client";
import { prisma } from "@/lib/initPrisma";
import { SignUpUser, SignUpUserSchema } from "@/models/user";
import { encryptPassword } from "@/lib/encryptPassword";
import { supabase } from "@/lib/initSupabase";
import moment from "moment";
import { ResponseMessage } from "@/lib/result";
import { AuthResponse } from "@supabase/supabase-js";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);

		return;
	}

	const result = SignUpUserSchema.safeParse(req.body);

	if (result.success) {
		try {
			const request: user = {
				...result.data,
				uid: `USER-${moment().format("YYMMDDHHmmssSSS")}`,
				password: await encryptPassword(result.data.password),
				first_page: BigInt("0"),
				enable_dashboard: false,
				is_dark_mode: false,
				created_on: new Date(),
				updated_on: new Date(),
			};

			const target: user = await prisma.user.create({
				data: request,
			});

			const signUpData: { email: string; password: string; phone?: string } = {
				email: request.email,
				password: request.password,
			};

			if (request.phone) {
				signUpData.phone = request.phone;
			}

			const authResponse: AuthResponse = await supabase.auth.signUp(signUpData);

			if (authResponse.error) {
				const user = await prisma.user.delete({
					where: {
						uid: target.uid,
					},
				});
				throw new Error(authResponse.error.message);
			}

			res
				.status(201)
				.json(
					ResponseMessage(201, `User ${target.uid} has been created`, target)
				);
		} catch (error: unknown) {
			console.error(error);
			if (error instanceof Error) {
				res.status(500).json(ResponseMessage(500, error.message));
			} else {
				res.status(500);
			}
		} finally {
			await prisma.$disconnect();
		}
	} else {
		res
			.status(400)
			.json(
				ResponseMessage(
					400,
					result.error.issues.map((issue) => issue.message).join(", "),
					null,
					result.error.issues.map((issue) => issue.code.toString()).join("")
				)
			);

		return;
	}
}
