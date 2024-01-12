import { ResponseMessage } from '@/lib/function/result';
import { db } from '@/lib/prisma/db';
import { AssetTag } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * @description Validator for updating an asset-tags
 */
const UpdateAssetTagsSchema = z.object({
  title: z.string().optional(),
  color: z.string().optional(),
});

/**
 * @description Type for updating an asset-tags
 */
type UpdateAssetTags = z.infer<typeof UpdateAssetTagsSchema>;

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} id - The unique identifier of the asset.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset-tags.
 */
export async function GET(
  nextRequest: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const id = params.id;
  const assetTags: AssetTag | null = await db.assetTag.findUnique({
    where: { id },
  });

  if (assetTags) {
    return new NextResponse(
      JSON.stringify(
        ResponseMessage(
          200,
          `Successfully fetched asset-tags ${id}!`,
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
      JSON.stringify(ResponseMessage(404, `Asset-tags ${id} not found`)),
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
 * @param {string} id - The unique identifier of the asset-tags.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset-tags.
 */
export async function PATCH(
  nextRequest: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = params.id;
    let json = await nextRequest.json();

    const result = UpdateAssetTagsSchema.safeParse(json);

    if (result.success) {
      const updateAssetTagsValue: UpdateAssetTags = result.data;
      const updatedAssetTags: AssetTag = await db.assetTag.update({
        where: { id },
        data: updateAssetTagsValue,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully updated asset-tags ${id}`,
            updatedAssetTags,
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
            `Asset-tag ${params.id} not found.`,
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
 * @param {string} id - The unique identifier of the asset.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset-tags.
 */
export async function DELETE(
  nextRequest: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = params.id;
    await db.assetTag.delete({
      where: { id },
    });

    return new NextResponse(
      JSON.stringify(ResponseMessage(200, `Asset-tags ${id} deleted`)),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            404,
            `Asset-tags ${params.id} not found`,
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
