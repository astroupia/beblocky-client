import { UserRole } from "../user";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string | null;
  role?: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Session {
  user: SessionUser;
  expires: string;
}

export interface AuthSession {
  data: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface SignInResult {
  data?: Session;
  error?: AuthError;
}

export interface SignUpResult {
  data?: Session;
  error?: AuthError;
}

export interface SignOutResult {
  error?: AuthError;
}
