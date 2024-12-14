import React, {
  createContext, useCallback, useEffect, useMemo, useState,
} from 'react';
import { deleteToken, getToken, onMessage } from 'firebase/messaging';
import { getMessaging } from '.';
import type { IAppNotificationsContext, IAppNotificationsProvider } from './types';
import { setStorage } from '../utils';

const CACHE_KEY = 'notificationsPermission';

export const AppNotificationsContext = createContext<IAppNotificationsContext>({
  permission: '',
  token: '',
  getNotificationToken: async () => { },
  requestPermission: async () => { },
  revokeToken: async () => { },
});

export default function AppNotificationsProvider({ children, onNotificationReceived, onTokenReceived, persistence }: IAppNotificationsProvider) {
  const [token, setToken] = useState('');
  const [permission, setPermission] = useState<NotificationPermission>();

  const persistCache = useCallback((value) => {
    switch (persistence) {
      case 'context':
        return setPermission(value);
      case 'local':
        return setStorage(CACHE_KEY, value);
      default:
        break;
    }
  }, []);

  const requestPermission = useCallback(async (onGranted?: () => void, onFail?: (permission: NotificationPermission) => void) => {
    const notificationsPermission = await Notification.requestPermission();
    persistCache(notificationsPermission);
    if (notificationsPermission === 'granted') {
      onGranted?.();
    } else {
      onFail?.(notificationsPermission);
    }
  }, [persistCache]);

  const revokeToken = useCallback(async () => {
    try {
      const messaging = getMessaging();
      await deleteToken(messaging);
      console.log('Token deleted.');
    } catch (error) {
      console.log('Unable to delete token:', error);
    }
  }, []);

  const getNotificationToken = useCallback(async () => {
    try {
      const messaging = getMessaging();
      const currentToken = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY });
      if (currentToken) {
        setToken(currentToken);
        // token not present or renewed
        onTokenReceived?.(currentToken);
      } else {
        // Request notifications permissions
        await requestPermission();
      }
    } catch (error) {
      console.log('An error occurred while retrieving token: ', error);
    }
  }, [requestPermission, onTokenReceived]);

  useEffect(() => {
    if (permission === 'granted') {
      getNotificationToken();
    }
  }, [permission, getNotificationToken]);

  useEffect(() => {
    // Handle app-in-focus incoming messages
    const messaging = getMessaging();
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      const { notification } = payload;
      onNotificationReceived?.(notification);
    });
    return () => {
      unsubscribe();
    }
  }, [onNotificationReceived]);

  const value = useMemo(() => ({
    permission,
    token,
    getNotificationToken,
    requestPermission,
    revokeToken,
  }), [permission, token, getNotificationToken, requestPermission, revokeToken]);

  return (
    <AppNotificationsContext.Provider
      value={value}
    >
      {children}
    </AppNotificationsContext.Provider>
  );
}
