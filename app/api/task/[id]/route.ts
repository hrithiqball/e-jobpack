import { ResponseMessage } from '@/lib/function/result';
import { db } from '@/lib/prisma/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * @description Validator for updating a task
 */
const UpdateTaskSchema = z.object({
  taskActivity: z.string().optional(),
  description: z.string().optional(),
  isComplete: z.boolean().optional(),
  remarks: z.string().optional(),
  issue: z.string().optional(),
  deadline: z.date().optional(),
  completedBy: z.string().optional(),
  taskOrder: z.number().optional(),
  haveSubtask: z.boolean().optional(),
  taskSelected: z.string().array().optional(),
  taskBool: z.boolean().optional(),
});

/**
 * @description Type for updating an task
 */
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} id - The unique identifier of the task.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the task.
 */
export async function GET(
  nextRequest: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const id = params.id;
  const task = await db.task.findUnique({
    where: { id },
  });

  if (task) {
    return new NextResponse(
      JSON.stringify(
        ResponseMessage(200, `Successfully fetched task ${id}!`, task),
      ),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } else {
    return new NextResponse(
      JSON.stringify(ResponseMessage(404, `Task ${id} not found`)),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

/**
 *
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} id - The unique identifier of the task.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the task.
 */
export async function PATCH(
  nextRequest: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = params.id;
    let json = await nextRequest.json();

    const result = UpdateTaskSchema.safeParse(json);
    console.log(result);

    if (result.success) {
      const updateTaskValue: UpdateTask = result.data;
      const updatedTask = await db.task.update({
        where: { id },
        data: updateTaskValue,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully updated task ${updatedTask.id}`,
            updatedTask,
          ),
        ),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      console.error(result.error.message);
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
    if (error.code === 'P2025') {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            404,
            `Task ${params.id} not found.`,
            null,
            error.message,
          ),
        ),
        {
          status: 404,
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

/**
 *
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} id - The unique identifier of the task.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the task.
 */
export async function DELETE(
  nextRequest: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = params.id;
    await db.task.delete({
      where: { id },
    });

    return new NextResponse(
      JSON.stringify(ResponseMessage(200, `Task ${id} deleted`)),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            404,
            `Task ${params.id} not found`,
            null,
            error.message,
          ),
        ),
        {
          status: 404,
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
