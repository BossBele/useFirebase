import { ActionCodeSettings } from "firebase-admin/auth";
import getAuth from "./getAuth";

/**
 * Admin SDK API to generate the password reset link.
 * @param {string} email
 * @param {ActionCodeSettings} [actionCodeSettings]
 * @returns {string}
 */
export default async function generatePasswordResetLink(email: string, actionCodeSettings?: ActionCodeSettings) {
  const auth = getAuth();
  // Construct password reset email template, embed the link and send using custom SMTP server.
  const link = await auth.generatePasswordResetLink(email, actionCodeSettings);
  return link;
}
