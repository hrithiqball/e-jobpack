'use server';

import { AuthError } from 'next-auth';

import { signIn } from '@/auth';
import { LoginForm } from '@/lib/schemas/auth';
import { getUserByEmail } from '@/data/user.auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

export async function login(form: LoginForm, callbackUrl?: string | null) {
  const { email, password } = form;

  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    throw new Error('User not found!');
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          throw new Error('Invalid password!');
        default:
          throw new Error('An error occurred');
      }
    }

    throw error;
  }
}
