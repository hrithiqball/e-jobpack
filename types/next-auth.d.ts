/* eslint-disable no-unused-vars */
import NextAuth, { type DefaultSession } from 'next-auth';
import { Role } from '@prisma/client';

export type ExtendedUser = DefaultSession['user'] & {
  role: Role;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id: string;
    email: string;
    emailVerified: Date | null;
    role: Role;
  }
}
