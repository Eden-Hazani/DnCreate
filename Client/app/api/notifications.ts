import * as Notifications from 'expo-notifications';
import authApi from './authApi';
import { store } from '../redux/store';
import logger from '../../utility/logger';

const askNotificationPermissions = async () => {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return;
        }
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
        const token = await Notifications.getExpoPushTokenAsync();
        authApi.registerNotificationToken(store.getState().user, token.data)
    } catch (err) {
        logger.log(err)
    }
};

export default askNotificationPermissions