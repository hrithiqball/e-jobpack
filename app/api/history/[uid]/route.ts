// GET one history

import { ResponseMessage } from '@/lib/function/result';
import { db } from '@/lib/prisma/db';
import { NextRequest, NextResponse } from 'next/server';

/**
 * This asynchronous function handles GET requests.
 * @param {NextRequest} nextRequest - The incoming HTTP request.
 * @param {string} uid - The unique identifier of the history.
 *
 * @returns {Promise<NextResponse>} Returns a promise that resolves with the result of the operation on the history.
 */
export async function GET(
  nextRequest: NextRequest,
  { params }: { params: { uid: string } },
): Promise<NextResponse> {
  const uid = params.uid;
  const history = await db.history.findUnique({
    where: { uid },
  });

  if (history) {
    return new NextResponse(
      JSON.stringify(
        ResponseMessage(200, `Successfully fetched history {${uid}}`, history),
      ),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } else {
    return new NextResponse(
      JSON.stringify(ResponseMessage(404, `History {${uid}} not found`)),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
