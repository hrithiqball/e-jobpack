import AuthCard from "@/components/AuthCard";

export default function SignIn({
	searchParams,
}: {
	searchParams: { message: string };
}) {
	return (
		<div>
			{/* <h1>Sign In Page</h1>
			<p>Text input here for signing in</p>
			<p>can also sign in using google and microsoft</p> */}
			<AuthCard searchParams={searchParams} />
		</div>
	);
}
