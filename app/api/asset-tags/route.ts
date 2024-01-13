import { AssetTag } from '@prisma/client';
import { ResponseMessage } from '@/lib/function/result';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/prisma/db';
import dayjs from 'dayjs';

/**
 * @description Validate the request body for adding a new asset-tags
 */
const AddAssetTagsSchema = z.object({
  title: z.string(),
  color: z.string().optional(),
  assetId: z.string(),
  assetTagsLibraryId: z.string(),
});

/**
 * @description Type for adding a new asset-tags
 */
type AddAssetTags = z.infer<typeof AddAssetTagsSchema> & {
  id: string;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset-tags.
 */
export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const assetTags: AssetTag[] = await db.assetTag.findMany();

    if (assetTags.length > 0) {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully fetched ${assetTags.length} assets`,
            assetTags,
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
 * @param {NextRequest} nextRequest - The incoming HTTP request. @type {asset_tags}
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset-tags.
 */
export async function POST(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const json = await nextRequest.json();

    const result = AddAssetTagsSchema.safeParse(json);
    if (result.success) {
      const request: AddAssetTags = {
        ...result.data,
        id: `ATAGS-${dayjs().format('YYMMDDHHmmssSSS')}`,
      };

      const assetTags: AssetTag = await db.assetTag.create({
        data: request,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            201,
            `Asset-tags ${request.id} has been successfully created`,
            assetTags,
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
        JSON.stringify(ResponseMessage(409, `Asset-tags already existed`)),
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
