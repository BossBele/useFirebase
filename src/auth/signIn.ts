import { signInWithEmailAndPassword, isSignInWithEmailLink, signInWithEmailLink, signInWithPhoneNumber, signInWithCredential, signInAnonymously, UserCredential, SignInMethod } from 'firebase/auth';
import getAuth from "./getAuth";
import { ISignIn, SignInMethodFB } from './types';

function getSignInMethod(method: string): SignInMethodFB {
  switch (method) {
    case 'email':
      return SignInMethod.EMAIL_PASSWORD;
    case 'email_link':
      return SignInMethod.EMAIL_LINK;
    case 'facebook':
      return SignInMethod.FACEBOOK;
    case 'github':
      return SignInMethod.GITHUB;
    case 'google':
      return SignInMethod.GOOGLE;
    case 'twitter':
      return SignInMethod.TWITTER;
    case 'password':
    case 'phone':
      return method;
    default:
      throw new Error('Unknown sign-in method');
  }
}

export default async function signIn({
  method,
  credentials: {
    email,
    password,
    providerId,
    link,
  },
  tenantId,
}: ISignIn): Promise<UserCredential> {
  const auth = getAuth();
  if (tenantId) {
    auth.tenantId = tenantId;
  }
  switch (method) {
    case 'anonymous':
      return signInAnonymously(auth);
    case 'email':
    case 'password':
      return signInWithEmailAndPassword(auth, email, password);
    case 'email_link':
      if(!isSignInWithEmailLink(auth, link)) {
        throw new Error('Invalid sign-in link');
      }
      return signInWithEmailLink(auth, email, link);
    case 'facebook':
    case 'google':
      return signInWithCredential(auth, { providerId, signInMethod: getSignInMethod(method), toJSON: () => ({ providerId }) });
    default:
      throw new Error('Unknown sign-in method');
  }
}
