import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Account } from '../screens/Account';
import React, { useEffect } from 'react'
import { HomeScreen } from '../screens/HomeScreen';
import CharNavigator from './CharacterNavigator';
import { Colors } from '../config/colors';
import { IconGen } from '../components/IconGen';
import AccNavigator from './AccountNavigator';
import AdventuresNavigator from './AdventuresNavigator';
import { store } from '../redux/store';
import * as Permissions from 'expo-permissions'
import * as Notifications from 'expo-notifications';
import logger from '../../utility/logger';
import authApi from '../api/authApi';
import navigation from './rootNavigation';

const Tab = createBottomTabNavigator();
const AppNavigator = () => {
    useEffect(() => {
        askNotificationPermissions();
        Notifications.addNotificationResponseReceivedListener(notification => {
            navigation.navigate('Adventures', null)
        })
    }, [])
    const askNotificationPermissions = async () => {
        try {
            const permissions = await Permissions.getAsync(Permissions.NOTIFICATIONS);
            if (!permissions.granted) return;
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

    return <Tab.Navigator tabBarOptions={{
        activeBackgroundColor: Colors.bitterSweetRed,
        activeTintColor: Colors.elementForeground,
        inactiveBackgroundColor: Colors.elementForeground,
        inactiveTintColor: Colors.inactiveTint,
        style: { borderTopWidth: 0 }
    }}>
        <Tab.Screen options={{ tabBarIcon: ({ color }) => <IconGen size={50} name={"home"} iconColor={color} /> }} name="Home" component={CharNavigator} />
        <Tab.Screen options={{ tabBarIcon: ({ color }) => <IconGen size={50} name={"account"} iconColor={color} /> }} name="Account" component={AccNavigator} />
        <Tab.Screen options={{ tabBarIcon: ({ color }) => <IconGen size={50} name={"map-outline"} iconColor={color} /> }} name="Adventures" component={AdventuresNavigator} />
    </Tab.Navigator>
}

export default AppNavigator