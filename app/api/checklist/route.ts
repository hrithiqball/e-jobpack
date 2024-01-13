import { Prisma, Checklist } from '@prisma/client';
import { ResponseMessage } from '@/lib/function/result';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/prisma/db';
import dayjs from 'dayjs';

/**
 * @description Validate the request body for adding a new checklist
 */
const AddChecklistSchema = z.object({
  title: z.string(),
  maintenanceId: z.string(),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  createdBy: z.string(),
  assetId: z.string(),
});

/**
 * @description Type for adding a new checklist
 */
type AddChecklist = z.infer<typeof AddChecklistSchema> & {
  id: string;
  updatedBy: string;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the checklist.
 */
export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    // filter params (all optional)
    const page_str = nextRequest.nextUrl.searchParams.get('page');
    const limit_str = nextRequest.nextUrl.searchParams.get('limit');

    const maintenanceId = nextRequest.nextUrl.searchParams.get('maintenanceId');

    const filters: Prisma.ChecklistWhereInput[] = [];
    const orderBy: Prisma.ChecklistOrderByWithRelationInput[] = [];

    if (maintenanceId) {
      filters.push({
        maintenanceId,
      });
    }

    const page = page_str ? parseInt(page_str, 10) : 1;
    const limit = limit_str ? parseInt(limit_str, 10) : 10;
    const skip = (page - 1) * limit;

    const checklists: Checklist[] = await db.checklist.findMany({
      skip,
      take: limit,
      orderBy,
      where: {
        AND: filters,
      },
    });

    if (checklists.length > 0) {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully fetched ${checklists.length} checklist`,
            checklists,
          ),
        ),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify(ResponseMessage(204, `No checklists found`)),
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
 * @param {NextRequest} nextRequest - The incoming HTTP request. @type {checklist}
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the checklist.
 */
export async function POST(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const json = await nextRequest.json();

    const result = AddChecklistSchema.safeParse(json);
    if (result.success) {
      const request: AddChecklist = {
        ...result.data,
        id: `CL-${dayjs().format('YYMMDDHHmmssSSS')}`,
        updatedBy: result.data.createdBy,
      };

      const checklist: Checklist = await db.checklist.create({
        data: request,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            201,
            `Checklist ${checklist.id} has been successfully created`,
            checklist,
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
        JSON.stringify(ResponseMessage(409, `Checklist already existed`)),
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
