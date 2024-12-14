import type { FirebaseApp } from "firebase/app";
import { Messaging, getMessaging as getMessagingFB } from "firebase/messaging";

export default function getMessaging(app?: FirebaseApp): Messaging {
  return getMessagingFB(app);
}
