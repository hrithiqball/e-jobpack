import { ResponseMessage } from '@/lib/function/result';
import { db } from '@/lib/prisma/db';
import dayjs from 'dayjs';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

/**
 * @description Validate the request body for adding a new history
 */
const AddHistorySchema = z.object({
  activity: z.string(),
  action_by: z.string(),
  task_uid: z.string().optional(),
  subtask_uid: z.string().optional(),
  maintenance_uid: z.string().optional(),
  asset_uid: z.string().optional(),
  subtask_use_uid: z.string().optional(),
  task_use: z.string().optional(),
  checklist_use: z.string().optional(),
  subtask_library_uid: z.string().optional(),
  task_library_uid: z.string().optional(),
  checklist_library_uid: z.string().optional(),
  asset_tags_library: z.string().optional(),
  asset_type_uid: z.string().optional(),
  asset_tags_uid: z.string().optional(),
  user_uid: z.string().optional(),
});

/**
 * @description Type for adding a new history
 */
type AddHistory = z.infer<typeof AddHistorySchema> & {
  uid: string;
  created_on: Date;
  action_on: Date;
};

export async function GET(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const histories = await db.history.findMany();

    if (histories.length > 0) {
      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            200,
            `Successfully fetched ${histories.length} histories`,
            histories,
          ),
        ),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify(ResponseMessage(204, `No history found`)),
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

export async function POST(nextRequest: NextRequest): Promise<NextResponse> {
  try {
    const json = await nextRequest.json();

    const result = AddHistorySchema.safeParse(json);
    if (result.success) {
      const request: AddHistory = {
        ...result.data,
        uid: `H-${dayjs().format('YYMMDDHHmmssSSS')}`,
        created_on: new Date(),
        action_on: new Date(),
      };

      const history = await db.history.create({
        data: request,
      });

      return new NextResponse(
        JSON.stringify(
          ResponseMessage(
            201,
            `Successfully created history {${history.uid}}`,
            history,
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
        JSON.stringify(ResponseMessage(409, `History already existed`)),
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
