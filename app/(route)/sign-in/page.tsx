import SignInCard from '@/components/client/SignInCard';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/data/auth';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const session = await getServerSession(authOptions);
  if (session) redirect('/dashboard');

  return (
    <div className="flex items-center justify-center h-full">
      {searchParams?.message && (
        <div className="absolute rounded-md mx-4 top-0 left-0 right-0 mt-4 p-4 bg-red-700 text-white text-center">
          <span>{searchParams.message}</span>
        </div>
      )}
      <SignInCard />
    </div>
  );
}
