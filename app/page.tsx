import AuthButton from '@/components/auth/AuthButton';
import Link from 'next/link';

export default async function Index() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <AuthButton />
      <Link href="/sign-up">Sign Up</Link>
    </div>
  );
}
