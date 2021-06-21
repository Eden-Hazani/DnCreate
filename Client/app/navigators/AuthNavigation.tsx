import { createStackNavigator } from '@react-navigation/stack';
import { Login } from '../screens/Login';
import { Register } from '../screens/Register';
import React from 'react';
import { Welcome } from '../screens/Welcome';
import { Colors } from '../config/colors';
import { ResetPassword } from '../screens/ResetPassword';
import RaceList from '../screens/CharCreation/RaceList';
import { SpacialProficiencyRaces } from '../screens/CharCreation/SpacialProficiencyRaces';
import NewCharInfo from '../screens/CharCreation/NewCharInfo';
import ClassPick from '../screens/CharCreation/ClassPick';
import CharSkillPick from '../screens/CharCreation/CharSkillPick';
import AttributePicking from '../screens/CharCreation/AttributePicking';
import CharBackground from '../screens/CharCreation/CharBackground';
import SpacialRaceBonuses from '../screens/CharCreation/SpacialRaceBonuses';
import { AddFeaturesToRace } from '../screens/CharCreation/AddFeaturesToRace';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducer';
import { AnimatedCreationProgressBar } from '../animations/AnimatedCreationProgressBar';

const Stack = createStackNavigator();

const AuthNavigator = () => {
    const progressBar = useSelector((state: RootState) => { return state.creationProgressBarValue });
    return <>
        {progressBar > -1 && <AnimatedCreationProgressBar />}
        <Stack.Navigator screenOptions={{ headerTintColor: Colors.whiteInDarkMode, cardStyle: { backgroundColor: Colors.pageBackground }, headerTransparent: true, headerStyle: { backgroundColor: Colors.bitterSweetRed, height: 45 }, headerTitleAlign: "center" }}>
            <Stack.Screen options={{ headerShown: false }} name="Welcome" component={Welcome} />
            <Stack.Screen options={{ title: "" }} name="Login" component={Login} />
            <Stack.Screen options={{ title: "" }} name="ResetPassword" component={ResetPassword} />
            <Stack.Screen options={{ title: "" }} name="Register" component={Register} />
            <Stack.Screen options={{ title: "" }} name="RaceList" component={RaceList} />
            <Stack.Screen options={{ title: "" }} name="SpacialProficiencyRaces" component={SpacialProficiencyRaces} />
            <Stack.Screen options={{ title: "" }} name="NewCharInfo" component={NewCharInfo} />
            <Stack.Screen options={{ title: "" }} name="ClassPick" component={ClassPick as any} />
            <Stack.Screen options={{ title: "" }} name="CharSkillPick" component={CharSkillPick} />
            <Stack.Screen options={{ title: "" }} name="AttributePicking" component={AttributePicking} />
            <Stack.Screen options={{ title: "" }} name="CharBackground" component={CharBackground} />
            <Stack.Screen options={{ title: "" }} name="SpacialRaceBonuses" component={SpacialRaceBonuses} />
            <Stack.Screen options={{ title: "", headerTintColor: Colors.black }} name="AddFeaturesToRace" component={AddFeaturesToRace} />
        </Stack.Navigator>
    </>
}

export default AuthNavigator;