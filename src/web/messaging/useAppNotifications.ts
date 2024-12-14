import { useContext } from 'react';
import { AppNotificationsContext } from './AppNotificationsProvider';
import { IAppNotificationsContext } from './types';

const useAppNotifications = () => useContext<IAppNotificationsContext>(AppNotificationsContext);
export default useAppNotifications;
