import { prisma } from '@/prisma/prisma';
import { ResponseMessage } from '@/lib/function/result';
import { task_use } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * @description Validator for updating a task_use
 */
const UpdateTaskUseSchema = z.object({
  task_activity: z.string().optional(),
  description: z.string().optional(),
  task_order: z.number().optional(),
  have_subtask: z.boolean().optional(),
  task_list_uid: z.string().optional(),
});

/**
 * @description Type for updating an task_use
 */
type UpdateTaskUse = z.infer<typeof UpdateTaskUseSchema>;

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} uid - The unique identifier of the task_use.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the task_use.
 */
export async function GET(
  nextRequest: NextRequest,
  { params }: { params: { uid: string } },
): Promise<NextResponse> {
  const uid = params.uid;
  const taskUse: task_use | null = await prisma.task_use.findUnique({
    where: { uid },
  });

  if (taskUse) {
    return new NextResponse(
      JSON.stringify(
        ResponseMessage(200, `Successfully fetched task_use ${uid}!`, taskUse),
      ),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } else {
    return new NextResponse(
      JSON.stringify(ResponseMessage(404, `Task use ${uid} not found`)),
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
 * @param {string} uid - The unique identifier of the task_use.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the task_use.
 */
export async function PATCH(
  nextRequest: NextRequest,
  { params }: { params: { uid: string } },
): Promise<NextResponse> {
  try {
    const uid = params.uid;
    let json = await nextRequest.json();

    const result = UpdateTaskUseSchema.safeParse(json);

    if (result.success) {
      const updateTaskUseValue: UpdateTaskUse = result.data;
      const updatedTaskUse: task_use = await prisma.task_use.update({
        where: { uid },
        data: updateTaskUseValue,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully updated task_use ${updatedTaskUse.uid}`,
            updatedTaskUse,
          ),
        ),
        {
          status: 200,
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
    if (error.code === 'P2025') {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            404,
            `Task use ${params.uid} not found.`,
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
 * @param {string} uid - The unique identifier of the task_use.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the task_use.
 */
export async function DELETE(
  nextRequest: NextRequest,
  { params }: { params: { uid: string } },
): Promise<NextResponse> {
  try {
    const uid = params.uid;
    await prisma.task_use.delete({
      where: { uid },
    });

    return new NextResponse(
      JSON.stringify(ResponseMessage(200, `Task use ${uid} deleted`)),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            404,
            `Task ${params.uid} not found`,
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
