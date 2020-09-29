import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import colors from '../config/colors';
import { Adventures } from '../screens/Adventures/Adventures';
import { JoinAdventure } from '../screens/Adventures/JoinAdventure';
import { SelectedLeadingAdv } from '../screens/Adventures/SelectedLeadingAdv';
import { SelectedParticipationAdv } from '../screens/Adventures/SelectedParticipationAdv';
import { StartAdventure } from '../screens/Adventures/StartAdventure';

const Stack = createStackNavigator();

const AdventuresNavigator = () => {
    return <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.bitterSweetRed, height: 45 }, headerTitleAlign: "center" }}>
        <Stack.Screen options={{ headerShown: false }} name="Adventures" component={Adventures} />
        <Stack.Screen options={{ headerShown: false }} name="StartAdventure" component={StartAdventure} />
        <Stack.Screen options={{ headerShown: false }} name="JoinAdventure" component={JoinAdventure} />
        <Stack.Screen options={{ headerShown: false }} name="SelectedParticipationAdv" component={SelectedParticipationAdv} />
        <Stack.Screen options={{ headerShown: false }} name="SelectedLeadingAdv" component={SelectedLeadingAdv} />
    </Stack.Navigator>
}

export default AdventuresNavigator;