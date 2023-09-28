import { supabase } from "@/lib/initSupabase";
import { ResponseMessage } from "@/lib/result";
import { NextRequest, NextResponse } from "next/server";

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} request - The incoming HTTP request.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation signing out.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const { error } = await supabase.auth.signOut();

		if (error) {
			throw new Error(error.message);
		} else {
			return new NextResponse(
				JSON.stringify(ResponseMessage(200, `Sign out successfully`)),
				{ status: 200, headers: { "Content-Type": "application/json" } }
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
