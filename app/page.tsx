import AuthButton from '@/components/client/AuthButton';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from './api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function Index() {
  const session = await getServerSession(authOptions);

  if (session) redirect('dashboard');

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <AuthButton />
      <Link href="/sign-up">Sign Up</Link>
    </div>
  );
}
