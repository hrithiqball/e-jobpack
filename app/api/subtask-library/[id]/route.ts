import { ResponseMessage } from '@/lib/function/result';
import { db } from '@/lib/prisma/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * @description Validator for updating a subtask_library
 */
const UpdateSubtaskLibrarySchema = z.object({
  task_activity: z.string().optional(),
  description: z.string().optional(),
  task_order: z.number().optional(),
  updated_by: z.string(),
});

/**
 * @description Type for updating an subtask_library
 */
type UpdateSubtaskLibrary = z.infer<typeof UpdateSubtaskLibrarySchema> & {
  updated_on: Date;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} id - The unique identifier of the subtask_library.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask_library.
 */
export async function GET(
  nextRequest: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const id = params.id;
  const subtaskLibrary = await db.subtaskLibrary.findUnique({
    where: { id },
  });

  if (subtaskLibrary) {
    return new NextResponse(
      JSON.stringify(
        ResponseMessage(
          200,
          `Successfully fetched subtask library ${id}!`,
          subtaskLibrary,
        ),
      ),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } else {
    return new NextResponse(
      JSON.stringify(ResponseMessage(404, `Subtask library ${id} not found`)),
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
 * @param {string} id - The unique identifier of the subtask_library.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask_library.
 */
export async function PATCH(
  nextRequest: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = params.id;
    let json = await nextRequest.json();

    const result = UpdateSubtaskLibrarySchema.safeParse(json);

    if (result.success) {
      const updateSubtaskLibraryValue: UpdateSubtaskLibrary = {
        ...result.data,
        updated_on: new Date(),
      };
      const updatedSubtaskLibrary = await db.subtaskLibrary.update({
        where: { id },
        data: updateSubtaskLibraryValue,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully updated subtask library ${updatedSubtaskLibrary.id}`,
            updatedSubtaskLibrary,
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
            `Subtask library ${params.id} not found.`,
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
 * @param {string} id - The unique identifier of the subtask_library.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the subtask_library.
 */
export async function DELETE(
  nextRequest: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = params.id;
    await db.subtaskLibrary.delete({
      where: { id },
    });

    return new NextResponse(
      JSON.stringify(ResponseMessage(200, `Subtask library ${id} deleted`)),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            404,
            `Subtask library ${params.id} not found`,
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
