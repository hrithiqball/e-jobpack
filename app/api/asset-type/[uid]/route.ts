import { prisma } from '@/prisma/prisma';
import { ResponseMessage } from '@/lib/function/result';
import { AssetType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * @description Validator for updating an asset-type
 */
const UpdateAssetTypeSchema = z.object({
  updated_by: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
});

/**
 * @description Type for updating an asset-type
 */
type UpdateAssetType = z.infer<typeof UpdateAssetTypeSchema> & {
  updated_on: Date;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} uid - The unique identifier of the asset-type.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset-type.
 */
export async function GET(
  nextRequest: NextRequest,
  { params }: { params: { uid: string } },
): Promise<NextResponse> {
  const uid = params.uid;
  const assetType: AssetType | null = await prisma.assetType.findUnique({
    where: { uid },
  });

  if (assetType) {
    return new NextResponse(
      JSON.stringify(
        ResponseMessage(
          200,
          `Successfully fetched asset type ${uid}!`,
          assetType,
        ),
      ),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } else {
    return new NextResponse(
      JSON.stringify(ResponseMessage(404, `Asset type ${uid} not found`)),
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
 * @param {string} uid - The unique identifier of the asset-type.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset-type.
 */
export async function PATCH(
  nextRequest: NextRequest,
  { params }: { params: { uid: string } },
): Promise<NextResponse> {
  try {
    const uid = params.uid;
    let json = await nextRequest.json();

    const result = UpdateAssetTypeSchema.safeParse(json);

    if (result.success) {
      const updateAssetTypeValue: UpdateAssetType = {
        ...result.data,
        updated_on: new Date(),
      };
      const updatedAssetType: AssetType = await prisma.assetType.update({
        where: { uid },
        data: updateAssetTypeValue,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully updated asset type ${uid}`,
            updatedAssetType,
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
            `Asset-type ${params.uid} not found.`,
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
 * @param {string} uid - The unique identifier of the asset-type.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset-type.
 */
export async function DELETE(
  nextRequest: NextRequest,
  { params }: { params: { uid: string } },
): Promise<NextResponse> {
  try {
    const uid = params.uid;
    await prisma.assetType.delete({
      where: { uid },
    });

    return new NextResponse(
      JSON.stringify(ResponseMessage(200, `Asset-type ${uid} deleted`)),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            404,
            `Asset-type ${params.uid} not found`,
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
