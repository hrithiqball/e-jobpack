import { ResponseMessage } from '@/lib/function/result';
import { db } from '@/lib/prisma/db';
import { Checklist } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * @description Validator for updating a checklist
 */
const UpdateChecklistSchema = z.object({
  updated_by: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

/**
 * @description Type for updating an checklist
 */
type UpdateChecklist = z.infer<typeof UpdateChecklistSchema>;

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} id - The unique identifier of the checklist.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the checklist.
 */
export async function GET(
  nextRequest: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const id = params.id;
  const checklist: Checklist | null = await db.checklist.findUnique({
    where: { id },
  });

  if (checklist) {
    return new NextResponse(
      JSON.stringify(
        ResponseMessage(
          200,
          `Successfully fetched checklist ${id}!`,
          checklist,
        ),
      ),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } else {
    return new NextResponse(
      JSON.stringify(ResponseMessage(404, `Checklist ${id} not found`)),
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
 * @param {string} id - The unique identifier of the checklist.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the checklist.
 */
export async function PATCH(
  nextRequest: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = params.id;
    let json = await nextRequest.json();

    const result = UpdateChecklistSchema.safeParse(json);

    if (result.success) {
      const updateChecklistValue: UpdateChecklist = {
        ...result.data,
      };
      const updatedChecklist: Checklist = await db.checklist.update({
        where: { id },
        data: updateChecklistValue,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully updated checklist ${id}`,
            updatedChecklist,
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
            `Checklist ${params.id} not found.`,
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
 * @param {string} id - The unique identifier of the checklist.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the checklist.
 */
export async function DELETE(
  nextRequest: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = params.id;
    await db.checklist.delete({
      where: { id },
    });

    return new NextResponse(
      JSON.stringify(ResponseMessage(200, `Checklist ${id} deleted`)),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            404,
            `Checklist ${params.id} not found`,
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
