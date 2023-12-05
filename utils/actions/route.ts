"use server";

import {
	Prisma,
	asset,
	checklist,
	checklist_use,
	maintenance,
	subtask,
	task,
	user,
} from "@prisma/client";
import { cookies, headers } from "next/headers";
import { MetadataUser, SignUpUser } from "@/model/user";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Result } from "@/lib/result";
import { UpdateTask } from "@/app/api/task/[uid]/route";
import { prisma } from "@/prisma/prisma";

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

export async function signUp(newUser: SignUpUser) {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);
	const originSignUp = headers().get("origin");

	const { error } = await supabase.auth.signUp({
		email: newUser.email,
		password: newUser.password,
		phone: newUser.phone ?? "",
		options: {
			emailRedirectTo: `${originSignUp}/auth/callback`,
		},
	});

	if (error) {
		console.error(error);
		redirect("/sign-in?message=Could not authenticate user");
	}

	const signUpResult = await signUpUser(newUser.name, originSignUp);
	if (signUpResult.statusCode !== 201) {
		redirect("/sign-in?message=Could not register user");
	}

	return redirect("/sign-in?message=Check email to continue sign in process");
}

async function signUpUser(name: string, originSignup: string | null) {
	if (!originSignup) alert("Origin is null");

	try {
		const response: Response = await fetch(`${originSignup}/api/sign-up`, {
			method: "POST",
			body: JSON.stringify({ name: name }),
		});
		const result: Result<user> = await response.json();

		if (result.statusCode !== 201) {
			console.error(result.message);
			throw new Error(result.message);
		}

		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function readUserSession() {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);

	return supabase.auth.getSession();
}

export async function readUserInfo() {
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
			headers: { "Content-Type": "application/json" },
			method: "GET",
		});
		const result: Result<asset[]> = await response.json();

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
			headers: { "Content-Type": "application/json" },
			method: "GET",
		});
		const result: Result<maintenance> = await response.json();

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
				headers: { "Content-Type": "application/json" },
				method: "GET",
			}
		);
		const result: Result<maintenance[]> = await response.json();

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
			headers: { "Content-Type": "application/json" },
			method: "GET",
		});
		const result: Result<checklist[]> = await response.json();

		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function fetchChecklistListByMaintenanceId(maintenanceId: string) {
	try {
		console.log(maintenanceId);
		const response: Response = await fetch(
			`${origin}/api/checklist?maintenance_uid=${maintenanceId ?? ""}`,
			{
				headers: { "Content-Type": "application/json" },
				method: "GET",
			}
		);
		const result: Result<checklist[]> = await response.json();

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
				headers: { "Content-Type": "application/json" },
				method: "GET",
			}
		);
		const result: Result<checklist_use[]> = await response.json();

		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

// task

export async function createTask(task: task) {
	try {
		const filters: Prisma.taskWhereInput[] = [
			{ checklist_uid: task.checklist_uid },
		];
		const orderBy: Prisma.taskOrderByWithRelationInput[] = [
			{ task_order: "desc" },
		];

		const tasks: task[] = await prisma.task.findMany({
			orderBy: orderBy,
			where: {
				AND: filters,
			},
		});

		if (tasks.length === 0) {
			task.task_order = 1;
		} else {
			task.task_order = tasks[0].task_order + 1;
		}

		const newTask: task = await prisma.task.create({
			data: task,
		});

		return newTask;
	} catch (error) {
		console.error(error);
	}
}

/**
 * fetch task list
 * @returns @type {Result<task[]>} of task list
 */
export async function fetchTaskList(): Promise<Result<task[]>> {
	try {
		const response: Response = await fetch(`${origin}/api/task`, {
			headers: { "Content-Type": "application/json" },
			method: "GET",
		});
		const result: Result<task[]> = await response.json();

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
				headers: { "Content-Type": "application/json" },
				method: "GET",
			}
		);
		const result: Result<task[]> = await response.json();
		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function updateTask(uid: string, updateTask: UpdateTask) {
	try {
		const updatedTaskValue: UpdateTask = updateTask;
		const updatedTask: task = await prisma.task.update({
			where: { uid },
			data: updatedTaskValue,
		});

		return updatedTask;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

// subtask

/**
 * fetch subtask list
 * @param task_uid
 * @returns @type {Result<subtask[]>} of subtask list
 */
export async function fetchSubtaskListByTaskUid(
	task_uid: string
): Promise<Result<subtask[]>> {
	try {
		const response: Response = await fetch(
			`${origin}/api/subtask?task_uid=${task_uid}`,
			{
				headers: { "Content-Type": "application/json" },
				method: "GET",
			}
		);
		const result: Result<subtask[]> = await response.json();
		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function updateSubtaskCompletion(
	subtaskUid: string,
	is_complete: boolean
) {
	try {
		const response: Response = await fetch(
			`${origin}/api/subtask/${subtaskUid}`,
			{
				headers: { "Content-Type": "application/json" },
				method: "PATCH",
				body: JSON.stringify({ is_complete }),
			}
		);
		const result: Result<subtask> = await response.json();

		console.log(result.data?.is_complete);
		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
