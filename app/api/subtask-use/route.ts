import { Prisma } from '@prisma/client';
import { ResponseMessage } from '@/lib/function/result';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import moment from 'moment';
import { db } from '@/lib/prisma/db';

/**
 * @description Validate the request body for adding a new subtask_use
 */
const AddSubtaskUseSchema = z.object({
  task_activity: z.string(),
  task_order: z.number(),
  description: z.string().optional(),
  subtask_library_uid: z.string().optional(),
  task_use_uid: z.string(),
});

export type AddSubtaskUseClient = Omit<
  z.infer<typeof AddSubtaskUseSchema>,
  'task_use_uid'
>;

export type AddSubtaskUseServer = z.infer<typeof AddSubtaskUseSchema>;

/**
 * @description Type for adding a new subtask_use
 */
type AddSubtaskUse = z.infer<typeof AddSubtaskUseSchema> & {
  uid: string;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask_use.
 */
export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const page_str = nextRequest.nextUrl.searchParams.get('page');
    const limit_str = nextRequest.nextUrl.searchParams.get('limit');
    const sort_by = nextRequest.nextUrl.searchParams.get('sortBy');
    const is_ascending = nextRequest.nextUrl.searchParams.get('isAscending');

    const taskUseUid = nextRequest.nextUrl.searchParams.get('taskUseUid');

    const filters: Prisma.SubtaskUseWhereInput[] = [];
    const orderBy: Prisma.SubtaskUseOrderByWithRelationInput[] = [];

    if (taskUseUid) {
      filters.push({ task_use_uid: taskUseUid });
    }

    const page = page_str ? parseInt(page_str, 10) : 1;
    const limit = limit_str ? parseInt(limit_str, 10) : 10;
    const isAscending = !!is_ascending;
    const sortBy = sort_by || 'task_order';
    const skip = (page - 1) * limit;

    if (isAscending) {
      orderBy.push({ [sortBy]: 'asc' });
    } else {
      orderBy.push({ [sortBy]: 'desc' });
    }

    const subtasksUse = await db.subtaskUse.findMany({
      where: {
        AND: filters,
      },
      orderBy,
      skip,
      take: limit,
    });

    if (subtasksUse.length > 0) {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully fetched ${subtasksUse.length} subtask_use`,
            subtasksUse,
          ),
        ),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify(ResponseMessage(204, `No subtasks use found`)),
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
 * @param {NextRequest} nextRequest - The incoming HTTP request. @type {subtask_use}
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask_use.
 */
export async function POST(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const json = await nextRequest.json();

    const result = AddSubtaskUseSchema.safeParse(json);
    if (result.success) {
      const request: AddSubtaskUse = {
        ...result.data,
        uid: `STUSE-${moment().format('YYMMDDHHmmssSSS')}`,
      };

      const subtaskUse = await db.subtaskUse.create({
        data: request,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            201,
            `Subtask use ${subtaskUse.uid} has been successfully created`,
            subtaskUse,
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
