import { prisma } from '@/prisma/prisma';
import { ResponseMessage } from '@/utils/function/result';
import { maintenance } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchMaintenanceItemById } from '../../server-actions';

/**
 * @description Validator for updating a maintenance
 */
const UpdateMaintenanceSchema = z.object({
  date: z.date().optional(),
  maintainee: z.string().optional(),
  attachment_path: z.string().optional(),
  approved_by: z.string().optional(),
  approved_on: z.date().optional(),
});

/**
 * @description Type for updating an maintenance
 */
type UpdateMaintenance = z.infer<typeof UpdateMaintenanceSchema>;

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} uid - The unique identifier of the maintenance.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the maintenance.
 */
export async function GET(
  nextRequest: NextRequest,
  { params }: { params: { uid: string } },
): Promise<NextResponse> {
  const maintenance = fetchMaintenanceItemById(params.uid);

  if (maintenance) {
    return new NextResponse(
      JSON.stringify(
        ResponseMessage(
          200,
          `Successfully fetched maintenance ${params.uid}!`,
          maintenance,
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
        ResponseMessage(404, `Maintenance ${params.uid} not found`),
      ),
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
 * @param {string} uid - The unique identifier of the maintenance.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the maintenance.
 */
export async function PATCH(
  nextRequest: NextRequest,
  { params }: { params: { uid: string } },
): Promise<NextResponse> {
  try {
    const uid = params.uid;
    let json = await nextRequest.json();

    const result = UpdateMaintenanceSchema.safeParse(json);

    if (result.success) {
      const updateMaintenanceValue: UpdateMaintenance = result.data;
      const updatedMaintenance: maintenance = await prisma.maintenance.update({
        where: { uid },
        data: updateMaintenanceValue,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully updated maintenance ${uid}`,
            updatedMaintenance,
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
            `Maintenance ${params.uid} not found.`,
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
 * @param {string} uid - The unique identifier of the maintenance.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the maintenance.
 */
export async function DELETE(
  nextRequest: NextRequest,
  { params }: { params: { uid: string } },
): Promise<NextResponse> {
  try {
    const uid = params.uid;
    await prisma.maintenance.delete({
      where: { uid },
    });

    return new NextResponse(
      JSON.stringify(ResponseMessage(200, `Maintenance ${uid} deleted`)),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            404,
            `Maintenance ${params.uid} not found`,
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
