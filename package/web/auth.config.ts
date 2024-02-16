import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { LoginSchema } from '@/lib/schemas';
import { getUserByEmail } from '@/data/user';

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const validatedFields = LoginSchema.safeParse(credentials);
          if (validatedFields.success) {
            const { email, password } = validatedFields.data;

            const user = await getUserByEmail(email);
            if (!user || !user.password) return null;

            const passwordsMatch = await bcrypt.compare(
              password,
              user.password,
            );

            if (passwordsMatch)
              return {
                id: user.id,
                email: user.email,
                emailVerified: user.emailVerified,
                name: user.name,
                image: user.image,
                role: user.role!,
              };

            return null;
          }
        } catch (error: any) {
          return null;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;