import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import colors from '../config/colors';
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

const Stack = createStackNavigator();

const CharNavigator = () => {
    return <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.bitterSweetRed, height: 45 }, headerTitleAlign: "center" }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="RaceList" component={RaceList} />
        <Stack.Screen options={{ title: "Character Info" }} name="NewCharInfo" component={NewCharInfo} />
        <Stack.Screen options={{ title: "Pick Class" }} name="ClassPick" component={ClassPick} />
        <Stack.Screen options={{ title: "Skills" }} name="CharSkillPick" component={CharSkillPick} />
        <Stack.Screen options={{ title: "Pick Attribute Points" }} name="AttributePicking" component={AttributePicking} />
        <Stack.Screen options={{ title: "Personality Traits" }} name="CharPersonalityTraits" component={CharPersonalityTraits} />
        <Stack.Screen options={{ title: "Ideals" }} name="CharIdeals" component={CharIdeals} />
        <Stack.Screen options={{ title: "Flaws" }} name="CharFlaws" component={CharFlaws} />
        <Stack.Screen options={{ title: "Bonds" }} name="CharBonds" component={CharBonds} />
        <Stack.Screen options={{ title: "Congratulations" }} name="SaveCharacter" component={SaveCharacter} />
        <Stack.Screen options={{ title: "BackStory" }} name="CharBackstory" component={CharBackstory} />
        <Stack.Screen options={{ title: "Character Hall" }} name="CharacterHall" component={CharacterHall} />
        <Stack.Screen options={{ title: "Character Sheet" }} name="SelectCharacter" component={SelectCharacter} />
        <Stack.Screen options={{ title: "Items and Currency" }} name="CharItems" component={CharItems} />
    </Stack.Navigator>
}

export default CharNavigator;