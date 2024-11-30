import { sendPasswordResetEmail as sendPasswordResetEmailController } from "firebase/auth";
import getAuth from "./getAuth";

export default async function sendPasswordResetEmail(email = '', url = ''): Promise<void> {
  const auth = getAuth();
  await sendPasswordResetEmailController(auth, email, { url });
}
