import Link from "next/link";

export default function Home() {
  return (
    <main>
      Welcome to Asset Management System!
      <br />
      <Link href="/dashboard">Dashboard</Link>
    </main>
  );
}
