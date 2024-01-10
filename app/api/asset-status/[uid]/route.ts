import { prisma } from '@/prisma/prisma';
import { ResponseMessage } from '@/lib/function/result';
import { AssetStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * @description Validator for updating an asset-status
 */
const UpdateAssetStatusSchema = z.object({
  title: z.string().optional(),
  color: z.string().optional(),
});

/**
 * @description Type for updating an asset-status
 */
type UpdateAssetStatus = z.infer<typeof UpdateAssetStatusSchema> & {
  uid: string;
};

/**
 *
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} uid - The unique identifier of the asset-status.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset-status.
 */
export async function GET(
  nextRequest: NextRequest,
  { params }: { params: { uid: string } },
): Promise<NextResponse> {
  const uid = params.uid;
  const assetStatus: AssetStatus | null = await prisma.assetStatus.findUnique({
    where: { uid },
  });

  if (assetStatus) {
    return new NextResponse(
      JSON.stringify(
        ResponseMessage(
          200,
          `Successfully fetched asset-status ${uid}`,
          assetStatus,
        ),
      ),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } else {
    return new NextResponse(
      JSON.stringify(ResponseMessage(404, `Asset-status ${uid} not found`)),
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
 * @param {string} uid - The unique identifier of the asset-status.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset-status.
 */
export async function PATCH(
  nextRequest: NextRequest,
  { params }: { params: { uid: string } },
): Promise<NextResponse> {
  try {
    const uid = params.uid;
    let json = await nextRequest.json();

    const result = UpdateAssetStatusSchema.safeParse(json);

    if (result.success) {
      const updateAssetValue: UpdateAssetStatus = {
        ...result.data,
        uid: uid,
      };
      const updatedAssetStatus: AssetStatus = await prisma.assetStatus.update({
        where: { uid },
        data: updateAssetValue,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully updated asset-status ${uid}`,
            updatedAssetStatus,
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
            `Asset-status ${params.uid} not found.`,
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
 * @param {string} uid - The unique identifier of the asset-status.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset-status.
 */
export async function DELETE(
  nextRequest: NextRequest,
  { params }: { params: { uid: string } },
): Promise<NextResponse> {
  try {
    const uid = params.uid;
    await prisma.assetStatus.delete({
      where: { uid },
    });

    return new NextResponse(
      JSON.stringify(ResponseMessage(200, `Asset-status ${uid} deleted`)),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            404,
            `Asset status ${params.uid} not found`,
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
