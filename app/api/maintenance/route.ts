import { Prisma } from '@prisma/client';
import { ResponseMessage } from '@/lib/function/result';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/prisma/db';
import dayjs from 'dayjs';

/**
 * @description Validate the request body for adding a new maintenance
 */
const AddMaintenanceSchema = z.object({
  asset_uid: z.string(),
  date: z.date(),
  maintainee: z.string().optional(),
  attachment_path: z.string().optional(),
  approved_by: z.string().optional(),
  approved_on: z.date().optional(),
});

/**
 * @description Type for adding a new maintenance
 */
type AddMaintenance = z.infer<typeof AddMaintenanceSchema> & {
  id: string;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the maintenance.
 */
export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const page_str = nextRequest.nextUrl.searchParams.get('page');
    const limit_str = nextRequest.nextUrl.searchParams.get('limit');
    const sort_by = nextRequest.nextUrl.searchParams.get('sort_by');
    const is_ascending = nextRequest.nextUrl.searchParams.get('is_ascending');
    // const assetIds = nextRequest.nextUrl.searchParams.get('assetIds');

    const filters: Prisma.MaintenanceWhereInput[] = [];
    const orderBy: Prisma.MaintenanceOrderByWithRelationInput[] = [];

    // if (assetIds) {
    //   filters.push({ assetIds });
    // }

    const page = page_str ? parseInt(page_str, 10) : 1;
    const limit = limit_str ? parseInt(limit_str, 10) : 10;
    const isAscending = !!is_ascending;
    const sortBy = sort_by || 'id';
    const skip = (page - 1) * limit;

    if (sortBy) {
      if (isAscending) {
        orderBy.push({
          [sortBy]: 'asc',
        });
      } else {
        orderBy.push({
          [sortBy]: 'desc',
        });
      }
    } else {
      orderBy.push({
        id: 'desc',
      });
    }

    const maintenances = await db.maintenance.findMany({
      skip,
      take: limit,
      orderBy,
      where: { AND: filters },
    });

    if (maintenances.length > 0) {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully fetched ${maintenances.length} maintenances`,
            maintenances,
          ),
        ),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify(ResponseMessage(204, `No maintenances found`)),
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
 * @param {NextRequest} nextRequest - The incoming HTTP request. @type {maintenance}
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the maintenance.
 */
export async function POST(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const json = await nextRequest.json();

    const result = AddMaintenanceSchema.safeParse(json);
    if (result.success) {
      const request: AddMaintenance = {
        ...result.data,
        id: `MT-${dayjs().format('YYMMDDHHmmssSSS')}`,
      };

      const maintenance = await db.maintenance.create({
        data: request,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            201,
            `Maintenance ${maintenance.id} has been successfully created`,
            maintenance,
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
        JSON.stringify(ResponseMessage(409, `Maintenance already existed`)),
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
