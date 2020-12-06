import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'
import CharNavigator from './CharacterNavigator';
import { Colors } from '../config/colors';
import { IconGen } from '../components/IconGen';
import AccNavigator from './AccountNavigator';


const Tab = createBottomTabNavigator();
const OfflineNavigator = () => {
    return <Tab.Navigator tabBarOptions={{
        activeBackgroundColor: Colors.bitterSweetRed,
        activeTintColor: Colors.elementForeground,
        inactiveBackgroundColor: Colors.elementForeground,
        inactiveTintColor: Colors.inactiveTint,
        style: { borderTopWidth: 0 }
    }}>
        <Tab.Screen options={{ tabBarIcon: ({ color }) => <IconGen size={50} name={"home"} iconColor={color} /> }} name="Home" component={CharNavigator} />
        <Tab.Screen options={{ tabBarIcon: ({ color }) => <IconGen size={50} name={"account"} iconColor={color} /> }} name="Account" component={AccNavigator} />
    </Tab.Navigator>
}

export default OfflineNavigator