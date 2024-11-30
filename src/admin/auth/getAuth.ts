import { App } from "firebase-admin/app";
import { Auth, getAuth as getAuthFB } from "firebase-admin/auth";

export default function getAuth(app?: App): Auth {
  return getAuthFB(app);
}