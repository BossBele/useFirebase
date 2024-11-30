import type { App } from "firebase-admin/app";
import { Messaging, getMessaging as getMessagingFB } from "firebase-admin/messaging";

export default function getMessaging(app?: App): Messaging {
  return getMessagingFB(app);
}
