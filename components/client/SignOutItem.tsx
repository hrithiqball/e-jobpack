import React from 'react';
import { signOut } from '@/app/api/server-actions';

export default async function SignOutItem() {
  return (
    <form action={signOut}>
      <button className="rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
        Logout
      </button>
    </form>
  );
}
