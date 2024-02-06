import SignInCard from '@/app/(route)/auth/login/SignInCard';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="flex h-full flex-1 items-center justify-center">
      {searchParams?.message && (
        <div className="absolute left-0 right-0 top-0 mx-4 mt-4 rounded-md bg-red-700 p-4 text-center text-white">
          <span>{searchParams.message}</span>
        </div>
      )}
      <SignInCard />
    </div>
  );
}
