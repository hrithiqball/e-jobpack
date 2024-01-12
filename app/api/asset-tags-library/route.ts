import { AssetTagLibrary } from '@prisma/client';
import { ResponseMessage } from '@/lib/function/result';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import moment from 'moment';
import { db } from '@/lib/prisma/db';

/**
 * @description Validate the request body for adding a new asset-tags from library
 */
const AddAssetTagsLibrarySchema = z.object({
  title: z.string(),
  color: z.string().optional(),
  assetTagsLibraryId: z.string(),
  createdBy: z.string(),
});

/**
 * @description Type for adding a new asset-tags from library
 */
type AddAssetTagsLibrary = z.infer<typeof AddAssetTagsLibrarySchema> & {
  id: string;
  updatedBy: string;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset.
 */
export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const assetTagsLibrary: AssetTagLibrary[] =
      await db.assetTagLibrary.findMany();

    if (assetTagsLibrary.length > 0) {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully fetched ${assetTagsLibrary.length} asset tags`,
            assetTagsLibrary,
          ),
        ),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify(ResponseMessage(204, `No asset tags found`)),
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
 * @param {NextRequest} nextRequest - The incoming HTTP request. @type {asset_tags_library}
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset-tags from library.
 */
export async function POST(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const json = await nextRequest.json();

    const result = AddAssetTagsLibrarySchema.safeParse(json);
    if (result.success) {
      const request: AddAssetTagsLibrary = {
        ...result.data,
        id: `ATAGS-${moment().format('YYMMDDHHmmssSSS')}`,
        updatedBy: result.data.createdBy,
      };

      const assetTagsLibrary: AssetTagLibrary = await db.assetTagLibrary.create(
        {
          data: request,
        },
      );

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            201,
            `Asset-tags ${request.id} has been successfully created`,
            assetTagsLibrary,
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
        JSON.stringify(ResponseMessage(409, `Asset tags already existed`)),
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
