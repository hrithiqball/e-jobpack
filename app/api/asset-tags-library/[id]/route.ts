import { ResponseMessage } from '@/lib/function/result';
import { db } from '@/lib/prisma/db';
import { AssetTagLibrary } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * @description Validator for updating an asset-tags in library
 */
const UpdateAssetTagsLibrarySchema = z.object({
  title: z.string().optional(),
  color: z.string().optional(),
  updated_by: z.string(),
});

/**
 * @description Type for updating an asset-tags in library
 */
type UpdateAssetTagsLibrary = z.infer<typeof UpdateAssetTagsLibrarySchema> & {
  updated_on: Date;
};

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} id - The unique identifier of the asset-tags in library.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset-tags in library.
 */
export async function GET(
  nextRequest: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const id = params.id;
  const assetTagsLibrary: AssetTagLibrary | null =
    await db.assetTagLibrary.findUnique({
      where: { id },
    });

  if (assetTagsLibrary) {
    return new NextResponse(
      JSON.stringify(
        ResponseMessage(
          200,
          `Successfully fetched asset-tags ${id} from library`,
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
      JSON.stringify(
        ResponseMessage(404, `Asset-tags ${id} from library not found`),
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
 * @param {string} id - The unique identifier of the asset-tags from library.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset-tags from library.
 */
export async function PATCH(
  nextRequest: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = params.id;
    let json = await nextRequest.json();

    const result = UpdateAssetTagsLibrarySchema.safeParse(json);

    if (result.success) {
      const updateAssetTagsValue: UpdateAssetTagsLibrary = {
        ...result.data,
        updated_on: new Date(),
      };
      const updatedAssetTagsLibrary: AssetTagLibrary =
        await db.assetTagLibrary.update({
          where: { id },
          data: updateAssetTagsValue,
        });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully updated asset-tags ${id} from library`,
            updatedAssetTagsLibrary,
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
            `Asset-tag ${params.id} not found from library.`,
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
 * @param {string} id - The unique identifier of the asset-tags from library.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the asset-tags from library.
 */
export async function DELETE(
  nextRequest: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const id = params.id;
    await db.assetTagLibrary.delete({
      where: { id },
    });

    return new NextResponse(
      JSON.stringify(
        ResponseMessage(200, `Asset-tags ${id} deleted from library`),
      ),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            404,
            `Asset-tags ${params.id} not found from library`,
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
