import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Colors } from '../config/colors';
import { store } from '../redux/store';
import { ActiveQuestList } from '../screens/Adventures/adventureComponents/ActiveQuestList';
import { AdventurePictureGallery } from '../screens/Adventures/adventureComponents/AdventurePictureGallery';
import { CompletedQuestList } from '../screens/Adventures/adventureComponents/CompletedQuestList';
import { Adventures } from '../screens/Adventures/Adventures';
import { JoinAdventure } from '../screens/Adventures/JoinAdventure';
import { LeadingAdventureList } from '../screens/Adventures/LeadingAdventureList';
import { ParticipatingAdventureList } from '../screens/Adventures/ParticipatingAdventureList';
import { SelectedLeadingAdv } from '../screens/Adventures/SelectedLeadingAdv';
import { SelectedParticipationAdv } from '../screens/Adventures/SelectedParticipationAdv';
import { StartAdventure } from '../screens/Adventures/StartAdventure';

const Stack = createStackNavigator();

const AdventuresNavigator = () => {
    const { subscribe } = store
    let baseColor = Colors.pageBackground
    useEffect(() => subscribe(
        () => setColor(Colors.pageBackground))
        , [])
    const [newColor, setColor] = useState(baseColor)
    return <Stack.Navigator screenOptions={{ headerTransparent: true, headerTintColor: Colors.whiteInDarkMode, cardStyle: { backgroundColor: newColor }, headerStyle: { backgroundColor: Colors.bitterSweetRed, height: 45 }, headerTitleAlign: "center" }}>
        <Stack.Screen options={{ title: "" }} name="Adventures" component={Adventures} />
        <Stack.Screen options={{ title: "" }} name="StartAdventure" component={StartAdventure} />
        <Stack.Screen options={{ title: "" }} name="JoinAdventure" component={JoinAdventure} />
        <Stack.Screen options={{ title: "" }} name="SelectedParticipationAdv" component={SelectedParticipationAdv} />
        <Stack.Screen options={{ title: "", headerShown: false }} name="SelectedLeadingAdv" component={SelectedLeadingAdv} />
        <Stack.Screen options={{ title: "", }} name="ActiveQuestList" component={ActiveQuestList} />
        <Stack.Screen options={{ title: "", }} name="CompletedQuestList" component={CompletedQuestList} />
        <Stack.Screen options={{ title: "", }} name="ParticipatingAdventureList" component={ParticipatingAdventureList} />
        <Stack.Screen options={{ title: "", }} name="LeadingAdventureList" component={LeadingAdventureList} />
        <Stack.Screen options={{ title: "", }} name="AdventurePictureGallery" component={AdventurePictureGallery} />
    </Stack.Navigator>
}

export default AdventuresNavigator;