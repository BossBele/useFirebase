import { ActionCodeSettings } from "firebase-admin/auth";
import getAuth from "./getAuth";

/**
 * @function generateEmailVerificationLink
 * Admin SDK API to generate the email verification link.
 * @param {string} email - The email address to verify
 * @param {ActionCodeSettings} [actionCodeSettings]
 * @returns {Promise<string>}
 */
export default async function generateEmailVerificationLink(email: string, actionCodeSettings?: ActionCodeSettings): Promise<string> {
  const auth = getAuth();
  // Construct email verification template, embed the link and send using custom SMTP server.
  const link = await auth.generateEmailVerificationLink(email, actionCodeSettings);
  return link;
}
