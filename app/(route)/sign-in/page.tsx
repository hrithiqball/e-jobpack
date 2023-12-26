import SignInCard from '@/components/client/SignInCard';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const session = await getServerSession(authOptions);
  if (session) redirect('/dashboard');

  return (
    <div>
      {searchParams?.message && (
        <div className="absolute rounded-md mx-4 top-0 left-0 right-0 mt-4 p-4 bg-red-700 text-white text-center">
          <span>{searchParams.message}</span>
        </div>
      )}
      <SignInCard />
    </div>
  );
}
