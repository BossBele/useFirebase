import admin from "../";

const auth = admin.auth();

export default auth;

export { default as getAuth } from "./getAuth";
export { default as generateEmailVerificationLink } from "./generateEmailVerificationLink";
export { default as generatePasswordResetLink } from "./generatePasswordResetLink";
