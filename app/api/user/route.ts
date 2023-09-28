import { prisma } from "@/lib/initPrisma";
import { ResponseMessage } from "@/lib/result";
import { Prisma, user } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const SignUpUserSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	phone: z.string(),
	password: z.string().min(8),
});

export type SignUpUser = z.infer<typeof SignUpUserSchema> & {
	uid: string;
	first_page: number;
	enable_dashboard: boolean;
	is_dark_mode: boolean;
	created_on: Date;
	updated_on: Date;
};

export const SignInUserSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export type SignInUser = z.infer<typeof SignInUserSchema>;

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} request - The incoming HTTP request.
 * @param params - Available params: `page`, `limit`, `sort_by`, `is_ascending`, `phone`
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the user.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
	// filter params (all optional)
	const page_str = request.nextUrl.searchParams.get("page");
	const limit_str = request.nextUrl.searchParams.get("limit");
	const sort_by = request.nextUrl.searchParams.get("sort_by");
	const is_ascending = request.nextUrl.searchParams.get("is_ascending");

	const phone = request.nextUrl.searchParams.get("phone");

	const filters: Prisma.userWhereInput[] = [];
	const orderBy: Prisma.userOrderByWithRelationInput[] = [];

	if (phone) {
		filters.push({ phone });
	}

	const page = page_str ? parseInt(page_str, 10) : 1;
	const limit = limit_str ? parseInt(limit_str, 10) : 10;
	const isAscending = !!is_ascending;
	const sortBy = sort_by || "updated_on";
	const skip = (page - 1) * limit;

	if (sortBy) {
		if (isAscending) {
			orderBy.push({
				[sortBy]: "asc",
			});
		} else {
			orderBy.push({
				[sortBy]: "desc",
			});
		}
	} else {
		orderBy.push({
			updated_on: "desc",
		});
	}

	const users: user[] = await prisma.user.findMany({
		skip,
		take: limit,
		orderBy: orderBy,
		where: {
			AND: filters,
		},
	});

	return NextResponse.json(
		ResponseMessage(200, "Successfully fetched users", users)
	);
}

// export default async function handler(
// 	req: NextApiRequest,
// 	res: NextApiResponse
// ) {
// 	if (req.method !== "POST") {
// 		res.setHeader("Allow", ["POST"]);
// 		res.status(405).end(`Method ${req.method} Not Allowed`);

// 		return;
// 	}

// 	const result = SignInUserSchema.safeParse(req.body);

// 	if (result.success) {
// 		try {
// 			const request: SignInUser = {
// 				...result.data,
// 			};

// 			const target: user | null = await prisma.user.findUnique({
// 				where: { email: request.email },
// 			});

// 			if (target) {
// 				const isMatched: boolean = await comparePassword(
// 					request.password,
// 					target.password
// 				);

// 				if (!isMatched) {
// 					res.status(401).json(ResponseMessage(401, "Password is not matched"));
// 				}

// 				const auth = await supabase.auth.signInWithPassword({
// 					email: request.email,
// 					password: target.password,
// 				});

// 				if (auth.error) throw new Error(auth.error.message);

// 				res.status(200).json({
// 					status: "OK",
// 					n;
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
// }message: `User ${target.uid} has been signed in`,
// 					token: auth.data.session.access_token,
// 				});

// 				return;
// 			} else {
// 				res
// 					.status(404)
// 					.json(ResponseMessage(404, `User ${request.email} not found`));

// 				return

// export default async function handler(
// 	req: NextApiRequest,
// 	res: NextApiResponse
// ) {
// 	if (req.method !== "POST") {
// 		res.setHeader("Allow", ["POST"]);
// 		res.status(405).end(`Method ${req.method} Not Allowed`);

// 		return;
// 	}

// 	const result = SignUpUserSchema.safeParse(req.body);

// 	if (result.success) {
// 		try {
// 			const request: user = {
// 				...result.data,
// 				uid: `USER-${moment().format("YYMMDDHHmmssSSS")}`,
// 				password: await encryptPassword(result.data.password),
// 				first_page: BigInt("0"),
// 				enable_dashboard: false,
// 				is_dark_mode: false,
// 				created_on: new Date(),
// 				updated_on: new Date(),
// 			};

// 			const target: user = await prisma.user.create({
// 				data: request,
// 			});

// 			const signUpData: { email: string; password: string; phone?: string } = {
// 				email: request.email,
// 				password: request.password,
// 			};

// 			if (request.phone) {
// 				signUpData.phone = request.phone;
// 			}

// 			const authResponse: AuthResponse = await supabase.auth.signUp(signUpData);

// 			if (authResponse.error) {
// 				const user = await prisma.user.delete({
// 					where: {
// 						uid: target.uid,
// 					},
// 				});
// 				throw new Error(authResponse.error.message);
// 			}

// 			res
// 				.status(201)
// 				.json(
// 					ResponseMessage(201, `User ${target.uid} has been created`, target)
// 				);
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

// export default async function handler(
// 	req: NextApiRequest,
// 	res: NextApiResponse
// ) {
// 	if (req.method !== "POST") {
// 		res.setHeader("Allow", ["POST"]);
// 		res.status(405).end(`Method ${req.method} Not Allowed`);

// 		return;
// 	}

// 	try {
// 		const { error } = await supabase.auth.signOut();

// 		if (error) {
// 			throw new Error(error.message);
// 		}

// 		res.status(200).json(ResponseMessage(200, "Sign out successfully"));
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ status: "Internal server error", message: error });
// 	}
// }
