import { prisma } from '@/prisma/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';

// https://www.youtube.com/watch?v=bkUmN9TH_hQ
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
          const data: User | null = await prisma.user.findUnique({
            where: { email },
          });

          if (!data)
            throw new Error(
              'User not found. Please enter a valid email address.',
            );

          const isMatch = await bcrypt.compare(password, data.password);
          if (!isMatch) throw new Error('Wrong password. Please try again.');

          return {
            id: data.id,
            emailVerified: data.email_verified,
            email: data.email,
            name: data.name,
            image: data.image,
            role: data.role,
          };
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, session }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
        };
      }
      console.log('jwt callback', { token, user, session });
      return token;
    },
    async session({ session, token, user }) {
      console.log('session callback', { session, token, user });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      };
    },
  },
  // callbacks: {
  //   async session(session): Promise<Session> {
  //     console.log(session);
  //     const user: User | null = await prisma.user.findUnique({
  //       where: { email: session.user.email },
  //     });
  //     if (user) {
  //       session.user = {
  //         id: user.id,
  //         emailVerified: user.email_verified,
  //         email: user.email,
  //         role: user.role,
  //       };
  //     }

  //     const expires = (Date.now() + 30 * 24 * 60 * 60 * 1000).toString();

  //     return {
  //       user: session.user,
  //       expires,
  //     };
  //   },
  // },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};
