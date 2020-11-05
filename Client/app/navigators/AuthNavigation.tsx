import { createStackNavigator } from '@react-navigation/stack';
import { Login } from '../screens/Login';
import { Register } from '../screens/Register';
import React from 'react';
import { Welcome } from '../screens/Welcome';
import colors from '../config/colors';
import { ResetPassword } from '../screens/ResetPassword';
import { RaceList } from '../screens/CharCreation/RaceList';
import { SpacialProficiencyRaces } from '../screens/CharCreation/SpacialProficiencyRaces';
import { NewCharInfo } from '../screens/CharCreation/NewCharInfo';
import { ClassPick } from '../screens/CharCreation/ClassPick';
import { CharSkillPick } from '../screens/CharCreation/CharSkillPick';
import { AttributePicking } from '../screens/CharCreation/AttributePicking';

const Stack = createStackNavigator();

const AuthNavigator = () => {
    return <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.bitterSweetRed, height: 45 }, headerTitleAlign: "center" }}>
        <Stack.Screen options={{ headerShown: false }} name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen options={{ headerShown: false }} name="RaceList" component={RaceList} />
        <Stack.Screen options={{ headerShown: false }} name="SpacialProficiencyRaces" component={SpacialProficiencyRaces} />
        <Stack.Screen options={{ title: "Character Info" }} name="NewCharInfo" component={NewCharInfo} />
        <Stack.Screen options={{ title: "Pick Class" }} name="ClassPick" component={ClassPick} />
        <Stack.Screen options={{ title: "Skills" }} name="CharSkillPick" component={CharSkillPick} />
        <Stack.Screen options={{ title: "Pick Attribute Points" }} name="AttributePicking" component={AttributePicking} />
    </Stack.Navigator>
}

export default AuthNavigator;