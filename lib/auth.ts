import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email as string },
        })

        if (!admin) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          admin.password
        )

        if (!isValid) return null

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { id: string }).id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-key-change-in-production',
})
