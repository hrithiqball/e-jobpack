import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = 'localhost:3000'; // use real domain on production

export async function sendTestEmail(email: string) {
  await resend.emails.send({
    from: 'mishu.asset.management@gmail.com',
    to: email,
    subject: 'Test email',
    html: `<p>
            Click me! <a href="${domain}">Site</a>
        </p>`,
  });
}
