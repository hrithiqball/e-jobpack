import NextAuth, { type DefaultSession } from 'next-auth';
import { Role } from '@prisma/client';

export type ExtendedUser = DefaultSession['user'] & {
  role: Role;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }

  interface User {
    id: string;
    email: string;
    emailVerified: Date | null;
    role: Role;
  }
}
