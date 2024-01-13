import { AssetType } from '@prisma/client';
import { ResponseMessage } from '@/lib/function/result';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/prisma/db';
import dayjs from 'dayjs';

/**
 * @description Validate the request body for adding a new asset-type
 */
const AddAssetTypeSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  createdBy: z.string(),
});

/**
 * @description Type for adding a new asset-type
 */
type AddAssetType = z.infer<typeof AddAssetTypeSchema> & {
  id: string;
  updatedBy: string;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset-types.
 */
export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const assetTypes: AssetType[] = await db.assetType.findMany();

    if (assetTypes.length > 0) {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully fetched ${assetTypes.length} asset-types`,
            assetTypes,
          ),
        ),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify(ResponseMessage(204, `No asset-types found`)),
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
 * @param {NextRequest} nextRequest - The incoming HTTP request. @type {asset}
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset.
 */
export async function POST(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const json = await nextRequest.json();

    const result = AddAssetTypeSchema.safeParse(json);
    if (result.success) {
      const request: AddAssetType = {
        ...result.data,
        id: `ATYPE-${dayjs().format('YYMMDDHHmmssSSS')}`,
        updatedBy: result.data.createdBy,
      };

      const assetType: AssetType = await db.assetType.create({
        data: request,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            201,
            `Asset-type ${assetType.id} has been successfully created`,
            assetType,
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
        JSON.stringify(ResponseMessage(409, `Asset-type already existed`)),
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
