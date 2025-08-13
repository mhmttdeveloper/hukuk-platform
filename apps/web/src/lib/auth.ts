import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { UserRole, VerificationStatus } from "@prisma/client"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  url: process.env.NEXTAUTH_URL,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user) {
            return null
          }

          // Check if user is verified
          if (user.verifiedStatus !== "VERIFIED") {
            throw new Error("Hesabınız henüz doğrulanmamış. Lütfen admin ile iletişime geçin.")
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.name} ${user.surname}`,
            role: user.role,
            verifiedStatus: user.verifiedStatus,
            profession: user.profession
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.verifiedStatus = user.verifiedStatus
        token.profession = user.profession
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as UserRole
        session.user.verifiedStatus = token.verifiedStatus as VerificationStatus
        session.user.profession = token.profession as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error"
  },
  events: {
    async signIn({ user }) {
      // Update last login time
      await prisma.user.update({
        where: { id: user.id },
        data: { updatedAt: new Date() }
      })
    }
  }
})
