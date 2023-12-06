import React from 'react';
import { signOut } from '@/utils/actions/route';

export default async function SignOutItem() {
  return (
    <form action={signOut}>
      <button className="rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
        Logout
      </button>
    </form>
  );
}
