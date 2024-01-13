import AuthButton from '@/components/client/auth/AuthButton';
import Link from 'next/link';

export default async function Index() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <AuthButton />
      <Link href="/sign-up">Sign Up</Link>
    </div>
  );
}
