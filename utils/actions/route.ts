"use server";

import {
	asset,
	checklist,
	checklist_use,
	maintenance,
	subtask,
	task,
	user,
} from "@prisma/client";
import { cookies } from "next/headers";
import { MetadataUser } from "@/model/user";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Result } from "@/lib/result";

const origin = process.env.NEXT_PUBLIC_ORIGIN;

export async function signIn(formData: FormData) {
	try {
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const cookieStore = cookies();
		const supabase = createClient(cookieStore);

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error(error);
			return redirect("/sign-in?message=Could not authenticate user");
		}

		redirect("/dashboard");
	} catch (error) {
		console.error(error, "here?");
		return redirect("/dashboard");
	}
}

export async function signOut() {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);

	supabase.auth.signOut();
	return redirect("/");
}

export async function ReadUserSession() {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);

	return supabase.auth.getSession();
}

export async function ReadUserInfo() {
	try {
		const cookieStore = cookies();
		const supabase = createClient(cookieStore);
		const { data } = await supabase.auth.getUser();

		if (data.user) {
			const response: Response = await fetch(
				`${origin}/api/user/${data.user.id}`,
				{ method: "GET" }
			);
			const result: Result<user> = await response.json();

			if (result.statusCode !== 200) {
				throw new Error(result.message);
			}

			if (result.data) {
				const userInfo: MetadataUser = {
					...data.user,
					name: result.data.name,
					role: result.data.role ?? "maintainer",
					department: result.data.department ?? "management",
					email: data.user.email,
					userId: data.user.id,
				};

				return userInfo;
			} else {
				console.error("User not found");
				return null;
			}
		} else {
			console.error("User not found");
			return null;
		}
	} catch (error) {
		console.error(error);
		throw error;
	}
}

// asset

export async function fetchAssetList(): Promise<Result<asset[]>> {
	try {
		const response: Response = await fetch(`${origin}/api/asset`, {
			method: "GET",
		});
		const result: Result<asset[]> = await response.json();

		if (!response.ok) {
			throw new Error(result.message);
		}

		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

// maintenance

export async function fetchMaintenanceItemById(uid: string) {
	try {
		const response: Response = await fetch(`${origin}/api/maintenance/${uid}`, {
			method: "GET",
		});
		const result: Result<maintenance> = await response.json();

		if (!response.ok) {
			throw new Error(result.message);
		}

		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function fetchMaintenanceList(
	assetUid?: string
): Promise<Result<maintenance[]>> {
	try {
		const response: Response = await fetch(
			`${origin}/api/maintenance?asset_uid=${assetUid ?? ""}`,
			{
				method: "GET",
			}
		);
		const result: Result<maintenance[]> = await response.json();

		if (!response.ok) {
			throw new Error(result.message);
		}

		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

// checklist

export async function fetchChecklistList(): Promise<Result<checklist[]>> {
	try {
		const response: Response = await fetch(`${origin}/api/checklist`, {
			method: "GET",
		});
		const result: Result<checklist[]> = await response.json();

		if (!response.ok) {
			throw new Error(result.message);
		}

		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function fetchChecklistListByMaintenanceId(maintenanceId: string) {
	try {
		const response: Response = await fetch(
			`${origin}/api/checklist?maintenance_uid=${maintenanceId ?? ""}`,
			{
				method: "GET",
			}
		);
		const result: Result<checklist[]> = await response.json();

		if (!response.ok) {
			throw new Error(result.message);
		}

		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

/**
 * fetch checklist use by asset
 * @param assetUid
 * @returns item of checklist
 */
export async function fetchChecklistUseList(assetUid: string) {
	try {
		const response: Response = await fetch(
			`${origin}/api/checklist-use?asset_uid=${assetUid ?? ""}`,
			{
				method: "GET",
			}
		);
		const result: Result<checklist_use[]> = await response.json();

		if (!response.ok) {
			throw new Error(result.message);
		}

		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

// task

/**
 * fetch task list
 * @returns @type {Result<task[]>} of task list
 */
export async function fetchTaskList(): Promise<Result<task[]>> {
	try {
		const response: Response = await fetch(`${origin}/api/task`, {
			method: "GET",
		});
		const result: Result<task[]> = await response.json();

		if (!response.ok) {
			throw new Error(result.message);
		}

		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

/**
 * fetch task list by checklist
 * @param checklistUid
 * @returns @type {Result<task[]>} of task list
 */
export async function fetchTaskListByChecklistUid(checklistUid: string) {
	try {
		const response: Response = await fetch(
			`${origin}/api/task?checklist_uid=${checklistUid}`,
			{
				method: "GET",
			}
		);
		const result: Result<task[]> = await response.json();

		if (!response.ok) {
			throw new Error(result.message);
		}

		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function updateTaskCompletion(
	taskUid: string,
	isCompleted: boolean
): Promise<Result<task>> {
	try {
		const response: Response = await fetch(`${origin}/api/task/${taskUid}`, {
			method: "PATCH",
			body: JSON.stringify({ isCompleted }),
		});
		const result: Result<task> = await response.json();

		if (result.statusCode !== 200) {
			console.error(result.message);
			throw new Error(result.message);
		}

		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

// subtask

/**
 * fetch subtask list
 * @returns @type {Result<subtask[]>} of subtask list
 */
export async function fetchSubtaskList(): Promise<Result<subtask[]>> {
	try {
		const response: Response = await fetch(`${origin}/api/subtask`, {
			method: "GET",
		});
		const result: Result<subtask[]> = await response.json();

		if (!response.ok) {
			throw new Error(result.message);
		}

		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
