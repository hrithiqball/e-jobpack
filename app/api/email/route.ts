import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import BrokenAsset from '@/lib/mail/component/broken-asset';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { name, email } = await request.json();

  try {
    await resend.emails.send({
      from: process.env.MAIL_FROM || '',
      to: email,
      subject: 'Broken Asset',
      react: BrokenAsset({ name }),
    });

    return NextResponse.json(
      {
        status: 'Ok',
      },
      {
        status: 200,
      },
    );
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
