import { EmailAuthCredential, EmailAuthProvider } from "firebase/auth";
import getAuth from "./getAuth";

export function getEmailAuthCredential(password = ''): EmailAuthCredential {
  // function for getting credential for reauthentication
  const auth = getAuth();
  return EmailAuthProvider.credential(auth.currentUser.email, password);
}
