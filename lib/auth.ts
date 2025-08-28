import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { PasswordResetEmail } from "@/components/email/password-reset-email";
import { EmailVerification } from "@/components/email";

const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Prisma client
const prisma = new PrismaClient();

// Initialize auth instance
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "https://beblocky.com",
    "https://www.beblocky.com",
    "https://code.beblocky.com",
  ],
  cookies: {
    sessionToken: {
      name: "better-auth.session_token",
      options: {
        domain:
          process.env.NODE_ENV === "production" ? ".beblocky.com" : undefined,
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production", // Only secure in production
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      resend.emails.send({
        from: "noreply@beblocky.com",
        to: user.email,
        subject: "Beblocky - Verify your email address",
        react: EmailVerification({
          userName: user.name,
          userEmail: user.email,
          verificationLink: url,
        }),
      });
    },
    sendOnSignUp: true,
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "noreply@beblocky.com",
        to: user.email,
        subject: "Beblocky - Reset Your Password",
        react: PasswordResetEmail({
          userName: user.name,
          userEmail: user.email,
          resetLink: url,
          termsUrl: "https://code.beblocky.com/terms-and-conditions",
        }),
      });
    },
    requireEmailVerification: false,
    transform: (data: {
      name: string;
      email: string;
      password: string;
      role?: string;
    }) => {
      return {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role || "student", // Use provided role or default to "student"
        emailVerified: false,
        updatedAt: new Date(),
      };
    },
  },
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      if (session.user && user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
