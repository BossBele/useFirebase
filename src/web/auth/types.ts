import { SignInMethod as SignInMethodFB, User } from "firebase/auth";

export type SignInMethodFB = typeof SignInMethodFB[keyof typeof SignInMethodFB];

export type SignInMethod = 'anonymous' | 'email' | 'email_link' | 'password' | 'phone' | 'facebook' | 'google' | 'twitter';
export interface ISignIn {
  method: SignInMethod,
  credentials: {
    email?: string,
    password?: string,
    link?: string,
    phoneNumber?: string,
    providerId?: string,
  },
  tenantId?: string,
}

export interface UserState {
  user: User | null
}