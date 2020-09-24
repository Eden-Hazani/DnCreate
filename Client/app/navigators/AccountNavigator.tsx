import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Account } from '../screens/Account';
import colors from '../config/colors';


const Stack = createStackNavigator();
const AccNavigator = () => {
    return <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.bitterSweetRed, height: 45 }, headerTitleAlign: "center" }}>
        <Stack.Screen name="Account" component={Account} />
    </Stack.Navigator>
}

export default AccNavigator;