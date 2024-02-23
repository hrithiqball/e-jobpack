import AuthComponent from '@/app/auth/_auth';

export default async function AuthPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      {searchParams?.message && (
        <div className="absolute left-0 right-0 top-0 mx-4 mt-4 rounded-md bg-red-700 p-4 text-center text-white">
          <span>{searchParams.message}</span>
        </div>
      )}
      <AuthComponent />
    </div>
  );
}
