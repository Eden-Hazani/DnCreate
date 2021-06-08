import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Account } from '../screens/Account';
import React, { useEffect } from 'react'
import { HomeScreen } from '../screens/HomeScreen';
import CharNavigator from './CharacterNavigator';
import { Colors } from '../config/colors';
import { IconGen } from '../components/IconGen';
import AccNavigator from './AccountNavigator';
import AdventuresNavigator from './AdventuresNavigator';
import * as Notifications from 'expo-notifications';
import navigation from './rootNavigation';
import CreationNavigator from './CreationNavigator';
import { AppState } from 'react-native';
import askNotificationPermissions from '../api/notifications';
import MarketPlaceNavigator from './MarketPlaceNavigator';

const Tab = createBottomTabNavigator();
const AppNavigator = () => {
    useEffect(() => {
        askNotificationPermissions();
        Notifications.addNotificationReceivedListener(response => {
            if (AppState.currentState === 'active') {
                Notifications.dismissAllNotificationsAsync()
            }
        });
        Notifications.addNotificationResponseReceivedListener(notification => {
            navigation.navigate('Adventures', null)
        })
    }, [])


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
        <Tab.Screen options={{ tabBarIcon: ({ color }) => <IconGen size={50} name={"creation"} iconColor={color} /> }} name="Creation" component={CreationNavigator} />
        <Tab.Screen options={{ tabBarIcon: ({ color }) => <IconGen size={50} name={"shopping-outline"} iconColor={color} /> }} name="Marketplace" component={MarketPlaceNavigator} />
    </Tab.Navigator>
}

export default AppNavigator