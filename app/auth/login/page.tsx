import SignInCard from '@/components/client/auth/SignInCard';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="flex flex-1 items-center justify-center h-full">
      {searchParams?.message && (
        <div className="absolute rounded-md mx-4 top-0 left-0 right-0 mt-4 p-4 bg-red-700 text-white text-center">
          <span>{searchParams.message}</span>
        </div>
      )}
      <SignInCard />
    </div>
  );
}
