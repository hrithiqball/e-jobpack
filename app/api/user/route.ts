import { prisma } from '@/prisma/prisma';
import { ResponseMessage } from '@/utils/function/result';
import { Prisma, user } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} request - The incoming HTTP request.
 * @param params - Available params: `page`, `limit`, `sort_by`, `is_ascending`, `phone`
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the user.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  // filter params (all optional)
  const page_str = request.nextUrl.searchParams.get('page');
  const limit_str = request.nextUrl.searchParams.get('limit');
  const sort_by = request.nextUrl.searchParams.get('sort_by');
  const is_ascending = request.nextUrl.searchParams.get('is_ascending');

  const filters: Prisma.userWhereInput[] = [];
  const orderBy: Prisma.userOrderByWithRelationInput[] = [];

  const page = page_str ? parseInt(page_str, 10) : 1;
  const limit = limit_str ? parseInt(limit_str, 10) : 10;
  const isAscending = !!is_ascending;
  const sortBy = sort_by || 'updated_on';
  const skip = (page - 1) * limit;

  if (sortBy) {
    if (isAscending) {
      orderBy.push({
        [sortBy]: 'asc',
      });
    } else {
      orderBy.push({
        [sortBy]: 'desc',
      });
    }
  } else {
    orderBy.push({
      updated_on: 'desc',
    });
  }

  const users: user[] = await prisma.user.findMany({
    skip,
    take: limit,
    orderBy: orderBy,
    where: {
      AND: filters,
    },
  });

  return NextResponse.json(
    ResponseMessage(200, 'Successfully fetched users', users),
  );
}
