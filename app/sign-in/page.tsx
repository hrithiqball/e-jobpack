import SignInCard from "@/components/SignInCard";

export default function SignInPage({
	searchParams,
}: {
	searchParams: { message: string };
}) {
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
