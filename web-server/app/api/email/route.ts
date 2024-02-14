import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

import BrokenAsset from '@/lib/mail/component/broken-asset';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);
const EmailSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export async function POST(nextRequest: NextRequest) {
  const json = await nextRequest.json();

  const validatedRequest = EmailSchema.safeParse(json);

  if (!validatedRequest.success)
    return NextResponse.json({ status: 'Failed' }, { status: 400 });

  const { email, name } = validatedRequest.data;

  try {
    await resend.emails.send({
      from: process.env.MAIL_FROM || '',
      to: email,
      subject: 'Broken Asset',
      react: BrokenAsset({ name }),
    });

    return NextResponse.json({ status: 'Ok' }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to send email: ${error.message}`);
    }

    return NextResponse.json(
      {
        status: 'Failed',
      },
      {
        status: 500,
      },
    );
  }
}
