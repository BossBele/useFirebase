import { EmailAuthCredential, EmailAuthProvider } from "firebase/auth";
import getAuth from "./getAuth";

export default function getEmailAuthCredential(password: string): EmailAuthCredential {
  // function for getting credential for reauthentication
  const auth = getAuth();
  return EmailAuthProvider.credential(auth.currentUser.email, password);
}
