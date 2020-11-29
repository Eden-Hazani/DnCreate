import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Account } from '../screens/Account';
import { Colors } from '../config/colors';
import { store } from '../redux/store';
import { CreateNewPath } from '../screens/charOptions/customPathComponents/CreateNewPath';
import { CustomPathing } from '../screens/charOptions/customPathComponents/CustomPathing';


const Stack = createStackNavigator();
const AccNavigator = () => {
    const { subscribe } = store
    let baseColor = Colors.pageBackground
    useEffect(() => subscribe(
        () => setColor(Colors.pageBackground))
        , [])
    const [newColor, setColor] = useState(baseColor)
    return <Stack.Navigator screenOptions={{ cardStyle: { backgroundColor: newColor }, headerStyle: { backgroundColor: Colors.bitterSweetRed, height: 45 }, headerTitleAlign: "center" }}>
        <Stack.Screen options={{ headerShown: false }} name="Account" component={Account} />
        <Stack.Screen options={{ headerShown: false }} name="CreateNewPath" component={CreateNewPath} />
        <Stack.Screen options={{ headerShown: false }} name="CustomPathing" component={CustomPathing} />
    </Stack.Navigator>
}

export default AccNavigator;