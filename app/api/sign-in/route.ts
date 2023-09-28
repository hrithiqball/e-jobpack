import { decryptPassword } from "@/lib/decryptPassword";
import { prisma } from "@/lib/initPrisma";
import { supabase } from "@/lib/initSupabase";
import { ResponseMessage } from "@/lib/result";
import { user } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * @description Validate the request body for signing in
 */
const SignInUserSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

/**
 * @description Type for signing in
 */
type SignInUser = z.infer<typeof SignInUserSchema>;

/**
 * This asynchronous function handles POST requests.
 * @param {Request} request - The incoming HTTP request. @type {SignInUser}
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the signing in.
 */
export async function POST(request: NextRequest) {
	try {
		const json = await request.json();
		const result = SignInUserSchema.safeParse(json);

		if (result.success) {
			const request: SignInUser = {
				...result.data,
			};

			const user: user | null = await prisma.user.findUnique({
				where: {
					email: request.email,
				},
			});

			if (user) {
				const isMatched: boolean = await decryptPassword(
					request.password,
					user.password
				);

				if (!isMatched) {
					return new NextResponse(
						JSON.stringify(ResponseMessage(401, `Password is not matched`)),
						{
							status: 401,
							headers: { "Content-Type": "application/json" },
						}
					);
				} else {
					const auth = await supabase.auth.signInWithPassword({
						email: request.email,
						password: user.password,
					});

					if (auth.error) {
						throw new Error(auth.error.message);
					} else {
						return new NextResponse(
							JSON.stringify(
								ResponseMessage(
									200,
									`Successfully signed in`,
									auth.data.session.access_token
								)
							),
							{
								status: 200,
								headers: { "Content-Type": "application/json" },
							}
						);
					}
				}
			} else {
				return new NextResponse(
					JSON.stringify(
						ResponseMessage(404, `User ${request.email} not found`)
					),
					{
						status: 404,
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
