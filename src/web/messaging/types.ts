import type { NotificationPayload } from "firebase/messaging";
import type { ReactNode } from "react";
import type { PersistenceType } from "../database/firestore/types";

export interface IAppNotificationsProvider {
  children?: ReactNode,
  onNotificationReceived?: (notification: NotificationPayload) => void,
  onTokenReceived?: (token: string) => void,
  persistence?: Omit<PersistenceType, 'session' | 'context'>,
}

export type requestPermission = (onGranted?: () => void, onFail?: (permission: NotificationPermission) => void) => Promise<void>;

export interface IAppNotificationsContext {
  permission: string,
  token: string,
  getNotificationToken: () => Promise<void>,
  requestPermission: requestPermission,
  revokeToken: () => Promise<void>,
}
