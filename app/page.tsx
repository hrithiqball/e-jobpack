import Link from 'next/link';

import AuthButton from '@/app/(route)/auth/AuthButton';

export default async function Index() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <AuthButton />
      <Link href="/auth/register">Sign Up</Link>
    </div>
  );
}
