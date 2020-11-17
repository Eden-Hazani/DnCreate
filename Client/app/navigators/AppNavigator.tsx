import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Account } from '../screens/Account';
import React from 'react'
import { HomeScreen } from '../screens/HomeScreen';
import CharNavigator from './CharacterNavigator';
import { Colors } from '../config/colors';
import { IconGen } from '../components/IconGen';
import AccNavigator from './AccountNavigator';
import AdventuresNavigator from './AdventuresNavigator';
import { store } from '../redux/store';

const Tab = createBottomTabNavigator();
const AppNavigator = () => {
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