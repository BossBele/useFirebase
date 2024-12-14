import type { App } from "firebase-admin/app";
import { Auth, TenantAwareAuth, getAuth as getAuthFB } from "firebase-admin/auth";
import type { IAuthOptions } from "./types";

export function getAuth(app?: App): Auth;
export function getAuth(authOptions?: IAuthOptions): TenantAwareAuth;

/**
 * @function getAuth
 * Get the Auth instance for the default app or a given app.
 * @param {App|IAuthOptions} [param] - The app or options to use.
 * @returns {Auth|TenantAwareAuth} - Auth instance
 */
export default function getAuth(param?: App|IAuthOptions): Auth|TenantAwareAuth {
  const authOptions = param as IAuthOptions;
  const appParam = param as App;
  const app = appParam?.name ? appParam : authOptions?.app;
  let auth: Auth|TenantAwareAuth = getAuthFB(app);
  if (authOptions?.tenantId) {
    auth = auth.tenantManager().authForTenant(authOptions.tenantId);
  }
  return auth;
}