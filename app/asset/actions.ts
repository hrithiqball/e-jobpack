"use server";

import { Result } from "@/lib/result";
import {
	asset,
	checklist,
	checklist_use,
	maintenance,
	subtask,
	task,
} from "@prisma/client";

export async function fetchAssetList(): Promise<Result<asset[]>> {
	try {
		const response: Response = await fetch("http://localhost:3000/api/asset", {
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

export async function fetchMaintenanceList(
	assetUid?: string
): Promise<Result<maintenance[]>> {
	try {
		const response: Response = await fetch(
			`${process.env.NEXT_PUBLIC_ORIGIN}/api/maintenance?asset_uid=${
				assetUid ?? ""
			}`,
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

export async function fetchChecklistUseList(assetUid: string) {
	try {
		const response: Response = await fetch(
			`${process.env.NEXT_PUBLIC_ORIGIN}/api/checklist-use?asset_uid=${
				assetUid ?? ""
			}`,
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

export async function fetchChecklistList(): Promise<Result<checklist[]>> {
	try {
		const response: Response = await fetch(
			"http://localhost:3000/api/checklist",
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

export async function fetchTaskList(): Promise<Result<task[]>> {
	try {
		const response: Response = await fetch("http://localhost:3000/api/task", {
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

export async function fetchSubtaskList(): Promise<Result<subtask[]>> {
	try {
		const response: Response = await fetch(
			"http://localhost:3000/api/subtask",
			{
				method: "GET",
			}
		);
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
