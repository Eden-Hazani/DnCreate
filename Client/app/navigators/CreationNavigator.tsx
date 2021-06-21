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
import { CreationScreen } from '../screens/CreationScreen';
import { CreateSubClass } from '../screens/SubClassCreation/CreateSubClass';
import { LevelChartSetUp } from '../screens/SubClassCreation/LevelChartSetUp';
import { AddLevelFeature } from '../screens/SubClassCreation/AddLevelFeature';
import { EditSubClassFeature } from '../screens/SubClassCreation/EditSubClassFeature';
import { CustomSubClassStart } from '../screens/SubClassCreation/CustomSubClassStart';
import { CustomSpellList } from '../screens/CustomSpellList';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducer';
import { CustomSpellCreator } from '../screens/CustomSpellCreator';


const Stack = createStackNavigator();
const CreationNavigator = () => {
    const [newColor, setColor] = useState(Colors.pageBackground)
    const colorScheme = useSelector((state: RootState) => { return state.colorScheme });
    useEffect(() => {
        setColor(Colors.pageBackground)
    }, [colorScheme])

    return <Stack.Navigator screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
        headerTintColor: Colors.whiteInDarkMode, cardStyle: { backgroundColor: newColor }, headerTransparent: true, headerStyle: { backgroundColor: Colors.bitterSweetRed, height: 45 }, headerTitleAlign: "center"
    }}>
        <Stack.Screen options={{ title: "" }} name="CreationScreen" component={CreationScreen} />
        <Stack.Screen options={{ title: "" }} name="CustomRaceStartScreen" component={CustomRaceStartScreen} />
        <Stack.Screen options={{ title: "" }} name="BasicRaceInfo" component={BasicRaceInfo} />
        <Stack.Screen options={{ title: "" }} name="RaceAttributeBonus" component={RaceAttributeBonus} />
        <Stack.Screen options={{ title: "" }} name="CustomRaceAbilities" component={CustomRaceAbilities} />
        <Stack.Screen options={{ title: "" }} name="CustomRaceBaseSkills" component={CustomRaceBaseSkills} />
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
        <Stack.Screen options={{ title: "" }} name="CustomSpellList" component={CustomSpellList} />
        <Stack.Screen options={{ title: "" }} name="CustomSpellCreator" component={CustomSpellCreator} />


        <Stack.Screen options={{ title: "" }} name="CreateSubClass" component={CreateSubClass} />
        <Stack.Screen options={{ title: "" }} name="CustomSubClassStart" component={CustomSubClassStart} />
        <Stack.Screen options={{ title: "" }} name="LevelChartSetUp" component={LevelChartSetUp} />
        <Stack.Screen options={{ title: "" }} name="AddLevelFeature" component={AddLevelFeature} />
        <Stack.Screen options={{ headerShown: false }} name="EditSubClassFeature" component={EditSubClassFeature} />
    </Stack.Navigator>
}

export default CreationNavigator;