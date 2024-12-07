import { sendPasswordResetEmail as sendPasswordResetEmailController } from "firebase/auth";
import getAuth from "./getAuth";

export default async function sendPasswordResetEmail(email: string, url: string): Promise<void> {
  const auth = getAuth();
  await sendPasswordResetEmailController(auth, email, { url });
}
