import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Colors } from '../config/colors';
import { store } from '../redux/store';
import { MarketHome } from '../screens/MarketPlace/MarketHome';


const Stack = createStackNavigator();

const MarketPlaceNavigator = () => {
    const { subscribe } = store
    let baseColor = Colors.pageBackground
    useEffect(() => subscribe(
        () => setColor(Colors.pageBackground))
        , [])
    const [newColor, setColor] = useState(baseColor)
    return <Stack.Navigator screenOptions={{ headerTransparent: true, headerTintColor: Colors.whiteInDarkMode, cardStyle: { backgroundColor: newColor }, headerStyle: { backgroundColor: Colors.bitterSweetRed, height: 45 }, headerTitleAlign: "center" }}>
        <Stack.Screen options={{ title: "" }} name="MarketHome" component={MarketHome} />
    </Stack.Navigator>
}

export default MarketPlaceNavigator;