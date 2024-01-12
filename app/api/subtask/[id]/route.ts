import { ResponseMessage } from '@/lib/function/result';
import { db } from '@/lib/prisma/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * @description Validator for updating a subtask
 */
const UpdateSubtaskSchema = z.object({
  task_activity: z.string().optional(),
  description: z.string().optional(),
  is_complete: z.boolean().optional(),
  remarks: z.string().optional(),
  issue: z.string().optional(),
  deadline: z.date().optional(),
  completed_by: z.string().optional(),
  task_order: z.number().optional(),
  task_bool: z.boolean().optional(),
  task_selected: z.string().array().optional(),
  task_number_val: z.number().optional(),
});

/**
 * @description Type for updating an subtask
 */
export type UpdateSubtask = z.infer<typeof UpdateSubtaskSchema>;

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} id - The unique identifier of the subtask.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask.
 */
export async function GET(
  nextRequest: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const id = params.id;
  const subtask = await db.subtask.findUnique({
    where: { id },
  });

  if (subtask) {
    return new NextResponse(
      JSON.stringify(
        ResponseMessage(200, `Successfully fetched subtask ${id}!`, subtask),
      ),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } else {
    return new NextResponse(
      JSON.stringify(ResponseMessage(404, `Subtask ${id} not found`)),
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
 * @param {string} id - The unique identifier of the subtask.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask.
 */
export async function PATCH(
  nextRequest: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = params.id;
    let json = await nextRequest.json();

    const result = UpdateSubtaskSchema.safeParse(json);

    if (result.success) {
      const updateSubtaskValue: UpdateSubtask = result.data;
      const updatedSubtask = await db.subtask.update({
        where: { id },
        data: updateSubtaskValue,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully updated subtask ${updatedSubtask.id}`,
            updatedSubtask,
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
            `Subtask ${params.id} not found.`,
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
 * @param {string} id - The unique identifier of the subtask.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask.
 */
export async function DELETE(
  nextRequest: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = params.id;
    await db.subtask.delete({
      where: { id },
    });

    return new NextResponse(
      JSON.stringify(ResponseMessage(200, `Subtask ${id} deleted`)),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            404,
            `Subtask ${params.id} not found`,
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
