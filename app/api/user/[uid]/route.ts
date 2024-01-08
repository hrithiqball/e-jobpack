import { prisma } from '@/prisma/prisma';
import { ResponseMessage } from '@/utils/function/result';
import { User } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * @description Validate the request body for updating an user
 */
const UpdateUserSchema = z.object({
  uid: z.string(),
  name: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(8).optional(),
  first_page: z.number().optional(),
  enable_dashboard: z.boolean().optional(),
  is_dark_mode: z.boolean().optional(),
});

/**
 * @description Type for updating an user
 */
type UpdateUser = z.infer<typeof UpdateUserSchema> & {
  updated_on: Date;
};

/**
 * This asynchronous function handles GET requests.
 *
 * @param {Request} request - The incoming HTTP request.
 * @param {string} email - The unique identifier of the user.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the user.
 */
export async function GET(
  request: Request,
  { params }: { params: { uid: any } },
): Promise<NextResponse> {
  try {
    const uid = params.uid;
    const user = await prisma.user.findUnique({
      where: { user_id: uid },
    });

    if (user) {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(200, `Successfully fetched user ${uid}!`, user),
        ),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(404, `User with ${params.uid} not found`),
        ),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2025') {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            404,
            `User uid ${params.uid} not found.`,
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
 * @param {Request} request - The incoming HTTP request.
 * @param {string} uid - The unique identifier of the user.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the user.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { uid: string } },
): Promise<NextResponse> {
  try {
    const id = params.uid;
    let json = await request.json();

    const result = UpdateUserSchema.safeParse(json);

    if (result.success) {
      const updateUserValue: UpdateUser = {
        ...result.data,
        updated_on: new Date(),
      };
      const updatedUser: User = await prisma.user.update({
        where: { id },
        data: updateUserValue,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(200, `Successfully updated user ${id}`, updatedUser),
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
            `User uid ${params.uid} not found.`,
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
 * @param {Request} request - The incoming HTTP request.
 * @param {string} uid - The unique identifier of the user.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the user.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { uid: string } },
): Promise<NextResponse> {
  try {
    const id = params.uid;
    await prisma.user.delete({
      where: { id },
    });
    //TODO delete user in supabase auth

    return new NextResponse(
      JSON.stringify(ResponseMessage(204, `No uid provided`)),
      { status: 204 },
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            404,
            `User uid ${params.uid} not found`,
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
