import { Prisma } from '@prisma/client';
import { ResponseMessage } from '@/lib/function/result';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import moment from 'moment';
import { db } from '@/lib/prisma/db';

/**
 * @description Validate the request body for adding a new subtask
 */
const AddSubtaskSchema = z.object({
  task_activity: z.string(),
  task_uid: z.string(),
  task_order: z.number(),
  description: z.string().optional(),
  remarks: z.string().optional(),
  issue: z.string().optional(),
  deadline: z.date().optional(),
});

/**
 * @description Type for adding a new subtask
 */
type AddSubtask = z.infer<typeof AddSubtaskSchema> & {
  uid: string;
  is_complete: boolean;
  completed_by: string | null;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask.
 */
export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    // filter params (all optional)
    const page_str = nextRequest.nextUrl.searchParams.get('page');
    const limit_str = nextRequest.nextUrl.searchParams.get('limit');
    const sort_by = nextRequest.nextUrl.searchParams.get('sort_by');

    const task_uid = nextRequest.nextUrl.searchParams.get('task_uid');

    const filters: Prisma.SubtaskWhereInput[] = [];
    const orderBy: Prisma.SubtaskOrderByWithRelationInput[] = [];

    if (task_uid) {
      filters.push({
        task_uid,
      });
    }

    const page = page_str ? parseInt(page_str, 10) : 1;
    const limit = limit_str ? parseInt(limit_str, 10) : 10;
    const sortBy = sort_by || 'task_order';
    const skip = (page - 1) * limit;

    orderBy.push({
      [sortBy]: 'asc',
    });

    const subtasks = await db.subtask.findMany({
      where: {
        AND: filters,
      },
      orderBy,
      skip,
      take: limit,
    });

    if (subtasks.length > 0) {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully fetched ${subtasks.length} subtask`,
            subtasks,
          ),
        ),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify(ResponseMessage(204, `No subtasks found`)),
        {
          status: 204,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify(ResponseMessage(500, error.message ?? error)),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

/**
 * This asynchronous function handles POST requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request. @type {subtask}
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask.
 */
export async function POST(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const json = await nextRequest.json();

    const result = AddSubtaskSchema.safeParse(json);
    if (result.success) {
      const request: AddSubtask = {
        ...result.data,
        uid: `CL-${moment().format('YYMMDDHHmmssSSS')}`,
        is_complete: false,
        completed_by: null,
      };

      const subtask = await db.subtask.create({
        data: request,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            201,
            `Subtask ${subtask.uid} has been successfully created`,
            subtask,
          ),
        ),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            400,
            result.error.issues.map(issue => issue.message).join(', '),
            null,
            result.error.issues.map(issue => issue.code.toString()).join(''),
          ),
        ),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return new NextResponse(
        JSON.stringify(ResponseMessage(409, `Subtask already existed`)),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    return new NextResponse(
      JSON.stringify(ResponseMessage(500, error.message)),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
