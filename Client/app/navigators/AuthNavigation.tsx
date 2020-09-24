import { createStackNavigator } from '@react-navigation/stack';
import { Login } from '../screens/Login';
import { Register } from '../screens/Register';
import React from 'react';
import { Welcome } from '../screens/Welcome';
import colors from '../config/colors';
import { ResetPassword } from '../screens/ResetPassword';

const Stack = createStackNavigator();

const AuthNavigator = () => {
    return <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.bitterSweetRed, height: 45 }, headerTitleAlign: "center" }}>
        <Stack.Screen options={{ headerShown: false }} name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
}

export default AuthNavigator;