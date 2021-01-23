import React, { useEffect, useState } from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { Colors } from '../config/colors';
import { store } from '../redux/store';
import { CustomRaceStartScreen } from '../screens/RaceCreation/CustomRaceStartScreen';
import { BasicRaceInfo } from '../screens/RaceCreation/BasicRaceInfo';
import { RaceAttributeBonus } from '../screens/RaceCreation/RaceAttributeBonus';
import { CustomRaceAbilities } from '../screens/RaceCreation/CustomRaceAbilities';
import { CustomRaceBaseSkills } from '../screens/RaceCreation/CustomRaceBaseSkills';
import { CustomRaceBaseTools } from '../screens/RaceCreation/CustomRaceBaseTools';
import { CustomRaceChoiceSkills } from '../screens/RaceCreation/CustomRaceChoiceSkills';
import { CustomRaceChoiceTools } from '../screens/RaceCreation/CustomRaceChoiceTools';
import { CustomRaceSpellPicking } from '../screens/RaceCreation/CustomRaceSpellPicking';
import { CustomRaceExtraLanguages } from '../screens/RaceCreation/CustomRaceExtraLanguages';
import { CustomRaceBaseWeaponProf } from '../screens/RaceCreation/CustomRaceBaseWeaponProf';
import { CustomRaceBaseArmorProf } from '../screens/RaceCreation/CustomRaceBaseArmorProf';
import { CustomRaceFinishScreen } from '../screens/RaceCreation/CustomRaceFinishScreen';
import { CustomRaceBackImage } from '../screens/RaceCreation/CustomRaceBackImage';
import { CustomRaceBonusAC } from '../screens/RaceCreation/CustomRaceBonusAC';


const Stack = createStackNavigator();
const CreationNavigator = () => {
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
        <Stack.Screen options={{ title: "" }} name="CustomRaceStartScreen" component={CustomRaceStartScreen} />
        <Stack.Screen options={{ title: "" }} name="BasicRaceInfo" component={BasicRaceInfo} />
        <Stack.Screen options={{ title: "" }} name="RaceAttributeBonus" component={RaceAttributeBonus} />
        <Stack.Screen options={{ title: "" }} name="CustomRaceAbilities" component={CustomRaceAbilities} />
        <Stack.Screen options={{ title: "" }} name="CustomRaceBaseSkillsState" component={CustomRaceBaseSkills} />
        <Stack.Screen options={{ title: "" }} name="CustomRaceBaseTools" component={CustomRaceBaseTools} />
        <Stack.Screen options={{ title: "" }} name="CustomRaceChoiceSkills" component={CustomRaceChoiceSkills} />
        <Stack.Screen options={{ title: "" }} name="CustomRaceChoiceTools" component={CustomRaceChoiceTools} />
        <Stack.Screen options={{ title: "" }} name="CustomRaceSpellPicking" component={CustomRaceSpellPicking} />
        <Stack.Screen options={{ title: "" }} name="CustomRaceExtraLanguages" component={CustomRaceExtraLanguages} />
        <Stack.Screen options={{ title: "" }} name="CustomRaceBaseWeaponProf" component={CustomRaceBaseWeaponProf} />
        <Stack.Screen options={{ title: "" }} name="CustomRaceBaseArmorProf" component={CustomRaceBaseArmorProf} />
        <Stack.Screen options={{ title: "" }} name="CustomRaceFinishScreen" component={CustomRaceFinishScreen} />
        <Stack.Screen options={{ title: "" }} name="CustomRaceBackImage" component={CustomRaceBackImage} />
        <Stack.Screen options={{ title: "" }} name="CustomRaceBonusAC" component={CustomRaceBonusAC} />
    </Stack.Navigator>
}

export default CreationNavigator;