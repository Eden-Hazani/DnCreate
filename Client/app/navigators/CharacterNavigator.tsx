import { createStackNavigator, TransitionPresets, CardStyleInterpolators } from '@react-navigation/stack';
import { Colors } from '../config/colors';
import { HomeScreen } from '../screens/HomeScreen';
import { RaceList } from '../screens/CharCreation/RaceList';
import { NewCharInfo } from '../screens/CharCreation/NewCharInfo';
import { ClassPick } from '../screens/CharCreation/ClassPick';
import { AttributePicking } from '../screens/CharCreation/AttributePicking';
import { CharBackstory } from '../screens/CharCreation/CharBackstory';
import { CharacterHall } from '../screens/CharacterHall';
import { SelectCharacter } from '../screens/SelectCharacter';
import { CharPersonalityTraits } from '../screens/CharCreation/CharPersonalityTraits';
import { CharIdeals } from '../screens/CharCreation/CharIdeals';
import { CharFlaws } from '../screens/CharCreation/CharFlaws';
import { CharBonds } from '../screens/CharCreation/CharBonds';
import { SaveCharacter } from '../screens/CharCreation/SaveCharacter';
import { CharSkillPick } from '../screens/CharCreation/CharSkillPick';
import { CharItems } from '../screens/CharItems';
import { SpacialProficiencyRaces } from '../screens/CharCreation/SpacialProficiencyRaces';
import { CharFeatures } from '../screens/CharFeatures';
import { CharFeats } from '../screens/CharFeats';
import { Spells } from '../screens/Spells';
import { Armor } from '../screens/charOptions/Armor';
import { PathFeatures } from '../screens/charOptions/PathFeatures';
import { CharBackground } from '../screens/CharCreation/CharBackground';
import { RaceFeatures } from '../screens/charOptions/RaceFeatures';
import { SpacialRaceBonuses } from '../screens/CharCreation/SpacialRaceBonuses';
import { store } from '../redux/store';
import React, { useEffect, useState } from 'react'
import { CreatePDF } from '../screens/CreatePDF';

const Stack = createStackNavigator();


const forFade = ({ current }: any) => ({
    cardStyle: {
        opacity: current.progress,
    },
});



const CharNavigator = () => {
    const { subscribe } = store
    let baseColor = Colors.pageBackground
    useEffect(() => subscribe(
        () => setColor(Colors.pageBackground))
        , [])
    const [newColor, setColor] = useState(baseColor)
    return <Stack.Navigator screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
        headerTintColor: Colors.whiteInDarkMode, cardStyle: { backgroundColor: newColor }, headerTransparent: true, headerStyle: { backgroundColor: Colors.bitterSweetRed, height: 45 }, headerTitleAlign: "center"
    }}>
        <Stack.Screen options={{ headerShown: false }} name="HomeScreen" component={HomeScreen} />
        <Stack.Screen options={{ title: "Race List", headerTransparent: false }} name="RaceList" component={RaceList} />
        <Stack.Screen options={{ headerShown: false }} name="SpacialProficiencyRaces" component={SpacialProficiencyRaces} />
        <Stack.Screen options={{ title: "" }} name="NewCharInfo" component={NewCharInfo} />
        <Stack.Screen options={{ title: "" }} name="ClassPick" component={ClassPick} />
        <Stack.Screen options={{ title: "" }} name="CharSkillPick" component={CharSkillPick} />
        <Stack.Screen options={{ title: "" }} name="AttributePicking" component={AttributePicking} />
        <Stack.Screen options={{ title: "Personality Traits", headerShown: false }} name="CharPersonalityTraits" component={CharPersonalityTraits} />
        <Stack.Screen options={{ title: "Ideals", headerShown: false }} name="CharIdeals" component={CharIdeals} />
        <Stack.Screen options={{ title: "Flaws", headerShown: false }} name="CharFlaws" component={CharFlaws} />
        <Stack.Screen options={{ title: "Bonds", headerShown: false }} name="CharBonds" component={CharBonds} />
        <Stack.Screen options={{ title: "Congratulations", headerShown: false }} name="SaveCharacter" component={SaveCharacter} />
        <Stack.Screen options={{ title: "" }} name="CharBackstory" component={CharBackstory} />
        <Stack.Screen options={{ title: "" }} name="CharacterHall" component={CharacterHall} />
        <Stack.Screen options={{ title: "" }} name="SelectCharacter" component={SelectCharacter} />
        <Stack.Screen options={{ title: "" }} name="CharItems" component={CharItems} />
        <Stack.Screen options={{ title: "" }} name="CharFeatures" component={CharFeatures} />
        <Stack.Screen options={{ title: "" }} name="CharFeats" component={CharFeats} />
        <Stack.Screen options={{ title: "Spells", headerTransparent: false }} name="Spells" component={Spells} />
        <Stack.Screen options={{ title: "" }} name="Armor" component={Armor} />
        <Stack.Screen options={{ title: "" }} name="CharBackground" component={CharBackground} />
        <Stack.Screen options={{ title: "" }} name="RaceFeatures" component={RaceFeatures} />
        <Stack.Screen options={{ title: "" }} name="PathFeatures" component={PathFeatures} />
        <Stack.Screen options={{ title: "" }} name="SpacialRaceBonuses" component={SpacialRaceBonuses} />
        <Stack.Screen options={{ title: "" }} name="CreatePDF" component={CreatePDF} />

    </Stack.Navigator>
}

export default CharNavigator;