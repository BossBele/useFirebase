import admin from "../";

const auth = admin.auth();

export default auth;

export { default as getAuth } from "./getAuth";
export { default as createSessionCookie } from "./createSessionCookie";
export { default as generateEmailVerificationLink } from "./generateEmailVerificationLink";
export { default as generatePasswordResetLink } from "./generatePasswordResetLink";
export { default as getCurrentUser } from "./getCurrentUser";
export { default as getSession } from "./getSession";
export { default as isUserAuthenticated } from "./isUserAuthenticated";
export { default as revokeSession } from "./revokeSession";
