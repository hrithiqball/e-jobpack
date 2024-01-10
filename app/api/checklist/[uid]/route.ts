import { prisma } from '@/prisma/prisma';
import { ResponseMessage } from '@/lib/function/result';
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
type UpdateChecklist = z.infer<typeof UpdateChecklistSchema> & {
  updated_on: Date;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} uid - The unique identifier of the checklist.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the checklist.
 */
export async function GET(
  nextRequest: NextRequest,
  { params }: { params: { uid: string } },
): Promise<NextResponse> {
  const uid = params.uid;
  const checklist: Checklist | null = await prisma.checklist.findUnique({
    where: { uid },
  });

  if (checklist) {
    return new NextResponse(
      JSON.stringify(
        ResponseMessage(
          200,
          `Successfully fetched checklist ${uid}!`,
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
      JSON.stringify(ResponseMessage(404, `Checklist ${uid} not found`)),
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
 * @param {string} uid - The unique identifier of the checklist.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the checklist.
 */
export async function PATCH(
  nextRequest: NextRequest,
  { params }: { params: { uid: string } },
): Promise<NextResponse> {
  try {
    const uid = params.uid;
    let json = await nextRequest.json();

    const result = UpdateChecklistSchema.safeParse(json);

    if (result.success) {
      const updateChecklistValue: UpdateChecklist = {
        ...result.data,
        updated_on: new Date(),
      };
      const updatedChecklist: Checklist = await prisma.checklist.update({
        where: { uid },
        data: updateChecklistValue,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully updated checklist ${uid}`,
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
            `Checklist ${params.uid} not found.`,
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
 * @param {string} uid - The unique identifier of the checklist.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the checklist.
 */
export async function DELETE(
  nextRequest: NextRequest,
  { params }: { params: { uid: string } },
): Promise<NextResponse> {
  try {
    const uid = params.uid;
    await prisma.checklist.delete({
      where: { uid },
    });

    return new NextResponse(
      JSON.stringify(ResponseMessage(200, `Checklist ${uid} deleted`)),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            404,
            `Checklist ${params.uid} not found`,
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
