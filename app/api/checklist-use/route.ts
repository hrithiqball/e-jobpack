import { ChecklistUse } from '@prisma/client';
import { ResponseMessage } from '@/lib/function/result';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import moment from 'moment';
import { db } from '@/lib/prisma/db';

/**
 * @description Validate the request body for adding a new checklist-use
 */
const AddChecklistUseSchema = z.object({
  title: z.string(),
  assetId: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  createdBy: z.string(),
});

export type AddChecklistUseClient = z.infer<typeof AddChecklistUseSchema>;

/**
 * @description Type for adding a new checklist-use
 */
type AddChecklistUse = z.infer<typeof AddChecklistUseSchema> & {
  id: string;
  updatedOn: Date;
  createdOn: Date;
  updatedBy: string;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the checklist-use.
 */
export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const checklistUse: ChecklistUse[] = await db.checklistUse.findMany();

    if (checklistUse.length > 0) {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully fetched ${checklistUse.length} checklist-use`,
            checklistUse,
          ),
        ),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify(ResponseMessage(204, `No checklist-use found`)),
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
 * @param {NextRequest} nextRequest - The incoming HTTP request. @type {checklist_use}
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the checklist-use.
 */
export async function POST(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const json = await nextRequest.json();

    const result = AddChecklistUseSchema.safeParse(json);
    if (result.success) {
      const request: AddChecklistUse = {
        ...result.data,
        id: `CLUSE-${moment().format('YYMMDDHHmmssSSS')}`,
        updatedOn: new Date(),
        createdOn: new Date(),
        updatedBy: result.data.createdBy,
      };

      const checklistUse: ChecklistUse = await db.checklistUse.create({
        data: request,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            201,
            `Checklist-use ${checklistUse.id} has been successfully created`,
            checklistUse,
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
        JSON.stringify(ResponseMessage(409, `Checklist-use already existed`)),
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
