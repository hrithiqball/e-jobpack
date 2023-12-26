import { prisma } from '@/prisma/prisma';
import { ResponseMessage } from '@/utils/function/result';
import { user } from '@prisma/client';
import moment from 'moment';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * @description Validate the request body for signing up
 */
const SignUpUserSchema = z.object({
  name: z.string(),
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
      const request: user = {
        ...result.data,
        id: `USER-${moment().format('YYMMDDHHmmssSSS')}`,
        first_page: 0,
        enable_dashboard: false,
        is_dark_mode: true,
        created_on: new Date(),
        updated_on: new Date(),
      };

      const user: user = await prisma.user.create({
        data: request,
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
