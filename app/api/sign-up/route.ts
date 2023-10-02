import { encryptPassword } from "@/lib/encryptPassword";
import { prisma } from "@/lib/initPrisma";
import { supabase } from "@/lib/initSupabase";
import { ResponseMessage } from "@/lib/result";
import { user } from "@prisma/client";
import { AuthResponse } from "@supabase/supabase-js";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * @description Validate the request body for signing up
 */
const SignUpUserSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	phone: z.string(),
	password: z.string().min(8),
});

/**
 * This asynchronous function handles POST requests.
 * @param {Request} request - The incoming HTTP request. @type {user}
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the signing in.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const json = await request.json();
		const result = SignUpUserSchema.safeParse(json);

		if (result.success) {
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

			const user: user = await prisma.user.create({
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
				await prisma.user.delete({
					where: {
						uid: user.uid,
					},
				});

				throw new Error(authResponse.error.message);
			} else {
				return new NextResponse(
					JSON.stringify(
						ResponseMessage(201, `User ${user.uid} has been created`, user)
					),
					{
						status: 201,
						headers: { "Content-Type": "application/json" },
					}
				);
			}
		} else {
			return new NextResponse(
				JSON.stringify(
					ResponseMessage(
						400,
						result.error.issues.map((issue) => issue.message).join(", "),
						null,
						result.error.issues.map((issue) => issue.code.toString()).join("")
					)
				),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}
	} catch (error: any) {
		return new NextResponse(
			JSON.stringify(ResponseMessage(500, error.message ?? error)),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
