import { ChecklistLibrary } from '@prisma/client';
import { ResponseMessage } from '@/lib/function/result';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import moment from 'moment';
import { db } from '@/lib/prisma/db';

/**
 * @description Validate the request body for adding a new checklist library
 */
const AddChecklistLibrarySchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  created_by: z.string(),
});

/**
 * @description Type for adding a new checklist library
 */
type AddChecklistLibrary = z.infer<typeof AddChecklistLibrarySchema> & {
  uid: string;
  updated_on: Date;
  created_on: Date;
  updated_by: string;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the checklist library.
 */
export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const checklistLibraries: ChecklistLibrary[] =
      await db.checklistLibrary.findMany();

    if (checklistLibraries.length > 0) {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully fetched ${checklistLibraries.length} checklist library`,
            checklistLibraries,
          ),
        ),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify(ResponseMessage(204, `No checklist-library found`)),
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
 * @param {NextRequest} nextRequest - The incoming HTTP request. @type {checklist_library}
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the checklist-library.
 */
export async function POST(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const json = await nextRequest.json();

    const result = AddChecklistLibrarySchema.safeParse(json);
    if (result.success) {
      const request: AddChecklistLibrary = {
        ...result.data,
        uid: `CLLIB-${moment().format('YYMMDDHHmmssSSS')}`,
        updated_on: new Date(),
        created_on: new Date(),
        updated_by: result.data.created_by,
      };

      const checklistLibrary: ChecklistLibrary =
        await db.checklistLibrary.create({
          data: request,
        });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            201,
            `Checklist library ${checklistLibrary.uid} has been successfully created`,
            checklistLibrary,
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
        JSON.stringify(
          ResponseMessage(409, `Checklist library already existed`),
        ),
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
