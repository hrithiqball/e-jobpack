import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/prisma/prisma';
import { user } from '@prisma/client';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials) {
        try {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };
          const userInfo: user | null = await prisma.user.findUnique({
            where: { email },
          });

          if (!userInfo)
            throw new Error(
              'User not found. Please enter a valid email address.',
            );

          const isMatch = await bcrypt.compare(password, userInfo.password);
          if (!isMatch) throw new Error('Wrong password. Please try again.');

          return userInfo;
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
