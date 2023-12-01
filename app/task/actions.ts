"use server";

import { Result } from "@/lib/result";
import { asset, checklist, maintenance, subtask, task } from "@prisma/client";

export async function fetchMaintenanceList(): Promise<Result<maintenance[]>> {
	try {
		const response: Response = await fetch(
			`${process.env.NEXT_PUBLIC_ORIGIN}/api/maintenance`,
			{
				method: "GET",
			}
		);
		if (!response.ok) {
			throw new Error("Error here");
		}
		const result: Result<maintenance[]> = await response.json();

		if (result.statusCode !== 200) {
			throw new Error(result.message);
		}

		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function fetchChecklistList(): Promise<Result<checklist[]>> {
	try {
		const response: Response = await fetch(
			`${process.env.NEXT_PUBLIC_ORIGIN}/api/checklist`,
			{
				method: "GET",
			}
		);
		if (!response.ok) {
			throw new Error("Error here");
		}
		const result: Result<checklist[]> = await response.json();

		if (result.statusCode !== 200) {
			throw new Error(result.message);
		}

		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function fetchAssetList(): Promise<Result<asset[]>> {
	try {
		const response: Response = await fetch(
			`${process.env.NEXT_PUBLIC_ORIGIN}/api/asset`,
			{
				method: "GET",
			}
		);
		if (!response.ok) {
			throw new Error("Error here");
		}
		const result: Result<asset[]> = await response.json();

		if (result.statusCode !== 200) {
			throw new Error(result.message);
		}

		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function fetchTaskList(): Promise<Result<task[]>> {
	try {
		const response: Response = await fetch(
			`${process.env.NEXT_PUBLIC_ORIGIN}/api/task`,
			{
				method: "GET",
			}
		);
		if (!response.ok) {
			throw new Error("Error here");
		}
		const result: Result<task[]> = await response.json();

		if (result.statusCode !== 200) {
			throw new Error(result.message);
		}

		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function fetchSubtaskList(): Promise<Result<subtask[]>> {
	try {
		const response: Response = await fetch(
			`${process.env.NEXT_PUBLIC_ORIGIN}/api/subtask`,
			{
				method: "GET",
			}
		);
		if (!response.ok) {
			throw new Error("Error here");
		}
		const result: Result<subtask[]> = await response.json();

		if (result.statusCode !== 200) {
			throw new Error(result.message);
		}

		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
