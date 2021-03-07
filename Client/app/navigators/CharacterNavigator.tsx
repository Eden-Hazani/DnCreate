import { createStackNavigator, TransitionPresets, CardStyleInterpolators } from '@react-navigation/stack';
import { Colors } from '../config/colors';
import { HomeScreen } from '../screens/HomeScreen';
import { RaceList } from '../screens/CharCreation/RaceList';
import { NewCharInfo } from '../screens/CharCreation/NewCharInfo';
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
import { CustomSpellCreator } from '../screens/CustomSpellCreator';
import { CustomSpellList } from '../screens/CustomSpellList';
import { CharWeapons } from '../screens/charOptions/CharWeapons';
import { CharEquipment } from '../screens/charOptions/CharEquipment';
import { PersonalNotes } from '../screens/PersonalNotes';
import { CitiesNote } from '../screens/charOptions/personalNoteTypes/CitiesNotes';
import { LocationNotes } from '../screens/charOptions/personalNoteTypes/LocationNotes';
import { PeopleNotes } from '../screens/charOptions/personalNoteTypes/PeopleNotes';
import { OtherNotes } from '../screens/charOptions/personalNoteTypes/OtherNotes';
import ClassPick from '../screens/CharCreation/ClassPick';
import { AddFeaturesToRace } from '../screens/CharCreation/AddFeaturesToRace';
import { CharacterAppearance } from '../screens/CharCreation/CharacterAppearance';
import { CharacterAlignment } from '../screens/CharCreation/CharacterAlignment';
import { ReplaceProficiencies } from '../screens/charOptions/ReplaceProficiencies';
import { ReplaceLanguages } from '../screens/charOptions/ReplaceLanguages';

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
        <Stack.Screen options={{ title: "", headerTintColor: Colors.black }} name="RaceList" component={RaceList} />
        <Stack.Screen options={{ title: "", headerTintColor: Colors.black }} name="AddFeaturesToRace" component={AddFeaturesToRace} />
        <Stack.Screen options={{ headerShown: false }} name="SpacialProficiencyRaces" component={SpacialProficiencyRaces} />
        <Stack.Screen options={{ title: "" }} name="NewCharInfo" component={NewCharInfo} />
        <Stack.Screen options={{ title: "" }} name="ClassPick" component={ClassPick as any} />
        <Stack.Screen options={{ title: "" }} name="CharSkillPick" component={CharSkillPick} />
        <Stack.Screen options={{ title: "" }} name="AttributePicking" component={AttributePicking} />
        <Stack.Screen options={{ title: "Personality Traits", headerShown: false }} name="CharPersonalityTraits" component={CharPersonalityTraits} />
        <Stack.Screen options={{ title: "Ideals", headerShown: false }} name="CharIdeals" component={CharIdeals} />
        <Stack.Screen options={{ title: "Flaws", headerShown: false }} name="CharFlaws" component={CharFlaws} />
        <Stack.Screen options={{ title: "Bonds", headerShown: false }} name="CharBonds" component={CharBonds} />
        <Stack.Screen options={{ title: "Congratulations", headerShown: false }} name="SaveCharacter" component={SaveCharacter} />
        <Stack.Screen options={{ title: "" }} name="CharBackstory" component={CharBackstory} />
        <Stack.Screen options={{ title: "" }} name="CharacterAppearance" component={CharacterAppearance} />
        <Stack.Screen options={{ title: "" }} name="CharacterAlignment" component={CharacterAlignment} />

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
        <Stack.Screen options={{ title: "" }} name="PersonalNotes" component={PersonalNotes} />
        <Stack.Screen options={{ title: "" }} name="CitiesNotes" component={CitiesNote} />
        <Stack.Screen options={{ title: "" }} name="LocationNotes" component={LocationNotes} />
        <Stack.Screen options={{ title: "" }} name="PeopleNotes" component={PeopleNotes} />
        <Stack.Screen options={{ title: "" }} name="OtherNotes" component={OtherNotes} />
        <Stack.Screen options={{ title: "" }} name="CustomSpellCreator" component={CustomSpellCreator} />
        <Stack.Screen options={{ title: "" }} name="CustomSpellList" component={CustomSpellList} />
        <Stack.Screen options={{ title: "" }} name="CharWeapons" component={CharWeapons} />
        <Stack.Screen options={{ title: "" }} name="CharEquipment" component={CharEquipment} />
        <Stack.Screen options={{ title: "" }} name="ReplaceProficiencies" component={ReplaceProficiencies} />
        <Stack.Screen options={{ title: "" }} name="ReplaceLanguages" component={ReplaceLanguages} />

    </Stack.Navigator>
}

export default CharNavigator;