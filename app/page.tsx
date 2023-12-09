import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import AuthButton from '@/components/client/AuthButton';
import { redirect } from 'next/navigation';
import { readUserSession } from '@/app/api/server-actions';
import { Fragment } from 'react';
import Link from 'next/link';

export default async function Index() {
  const cookieStore = cookies();

  const initSupabaseClient = () => {
    try {
      createClient(cookieStore);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const isSupabaseConnected = initSupabaseClient();
  const { data } = await readUserSession();

  if (data.session) {
    return redirect('/dashboard');
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {isSupabaseConnected && (
        <Fragment>
          <AuthButton />
          <Link href="/sign-up">Sign Up</Link>
        </Fragment>
      )}
    </div>
  );
}
