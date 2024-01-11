import { ResponseMessage } from '@/lib/function/result';
import { db } from '@/lib/prisma/db';
import { AssetStatus } from '@prisma/client';
import moment from 'moment';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

/**
 * @description Validate the request body for adding a new asset-status
 */
const AddAssetStatusSchema = z.object({
  title: z.string(),
  color: z.string(),
});

/**
 * @description Type for adding a new asset-status
 */
type AddAssetStatus = z.infer<typeof AddAssetStatusSchema> & { uid: string };

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset-status.
 */
export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const assetStatuses: AssetStatus[] = await db.assetStatus.findMany();

    if (assetStatuses.length > 0) {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully fetched ${assetStatuses.length} status-assets`,
          ),
        ),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify(ResponseMessage(204, `No assets found`)),
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
 * @param {NextRequest} nextRequest - The incoming HTTP request. @type {asset_status}
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset-status.
 */
export async function POST(nextRequest: NextRequest) {
  try {
    const json = await nextRequest.json();

    const result = AddAssetStatusSchema.safeParse(json);
    if (result.success) {
      const req: AddAssetStatus = {
        ...result.data,
        uid: `ASTATUS-${moment().format('YYMMDDHHmmssSSS')}`,
      };

      const assetStatus: AssetStatus = await db.assetStatus.create({
        data: req,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully created asset status ${assetStatus.uid}`,
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
        JSON.stringify(ResponseMessage(409, `Asset status already existed`)),
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
