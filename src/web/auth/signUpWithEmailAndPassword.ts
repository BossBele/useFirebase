import { UserCredential, createUserWithEmailAndPassword } from "firebase/auth";
import getAuth from "./getAuth";

export default async function signUpWithEmailAndPassword(email = '', password = ''): Promise<UserCredential> {
  const auth = getAuth();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential;
}
