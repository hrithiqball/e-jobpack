import { Prisma } from '@prisma/client';
import { ResponseMessage } from '@/lib/function/result';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/prisma/db';
import dayjs from 'dayjs';

/**
 * @description Validate the request body for adding a new task_use
 */
const AddTaskUseSchema = z.object({
  taskActivity: z.string(),
  description: z.string().optional(),
  taskOrder: z.number(),
  haveSubtask: z.boolean(),
  checklistUseId: z.string(),
  taskLibraryId: z.string().optional(),
});

export type AddTaskUseClient = Omit<
  z.infer<typeof AddTaskUseSchema>,
  'checklist_use_uid'
>;

export type AddTaskUseServer = z.infer<typeof AddTaskUseSchema>;

/**
 * @description Type for adding a new task_use
 */
type AddTaskUse = z.infer<typeof AddTaskUseSchema> & {
  id: string;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the task_use.
 */
export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const page_str = nextRequest.nextUrl.searchParams.get('page');
    const limit_str = nextRequest.nextUrl.searchParams.get('limit');
    const sort_by = nextRequest.nextUrl.searchParams.get('sortBy');
    const is_ascending = nextRequest.nextUrl.searchParams.get('isAscending');

    const checklistUseId =
      nextRequest.nextUrl.searchParams.get('checklistUseId');

    const filters: Prisma.TaskUseWhereInput[] = [];
    const orderBy: Prisma.TaskUseOrderByWithRelationInput[] = [];

    if (checklistUseId) {
      filters.push({ checklistUseId });
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

    const tasks = await db.taskUse.findMany({
      skip,
      take: limit,
      orderBy: {
        taskOrder: 'asc',
      },
      where: {
        AND: filters,
      },
    });

    if (tasks.length > 0) {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully fetched ${tasks.length} tasks`,
            tasks,
          ),
        ),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify(ResponseMessage(204, `No tasks found`)),
        {
          status: 200,
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
 * @param {NextRequest} nextRequest - The incoming HTTP request. @type {task_use}
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the task_use.
 */
export async function POST(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const json = await nextRequest.json();

    const result = AddTaskUseSchema.safeParse(json);
    if (result.success) {
      result.data.taskLibraryId =
        result.data.taskLibraryId == '' ? undefined : result.data.taskLibraryId;
      const request: AddTaskUse = {
        ...result.data,
        id: `TSUSE-${dayjs().format('YYMMDDHHmmssSSS')}`,
      };

      console.log(request);

      const taskUse = await db.taskUse.create({
        data: request,
      });

      console.log(taskUse);

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            201,
            `Task ${taskUse.id} has been successfully created`,
            taskUse,
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
    console.error(error);
    if (error.code === 'P2002') {
      return new NextResponse(
        JSON.stringify(ResponseMessage(409, `Task already existed`)),
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
