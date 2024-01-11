import { ResponseMessage } from '@/lib/function/result';
import { db } from '@/lib/prisma/db';
import { User } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * @description Validate the request body for signing up
 */
const SignUpUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

/**
 * This asynchronous function handles POST requests.
 * @param {Request} request - The incoming HTTP request. @type {user}
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the signing in.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const json = await request.json();
    const result = SignUpUserSchema.safeParse(json);

    if (result.success) {
      const user: User = await db.user.create({
        data: {
          ...result.data,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(201, `User ${user.id} has been created`, user),
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
    return new NextResponse(
      JSON.stringify(ResponseMessage(500, error.message ?? error)),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
