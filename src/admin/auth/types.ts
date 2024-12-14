import { App } from "firebase-admin/app";

export interface IAuthOptions {
  app?: App,
  tenantId?: string,
}