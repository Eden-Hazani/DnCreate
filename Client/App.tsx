import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import * as Font from 'expo-font'
import { NavigationContainer } from '@react-navigation/native'
import navigationTheme from './app/navigators/navigationTheme';
import AppNavigator from './app/navigators/AppNavigator';
import AuthNavigator from './app/navigators/AuthNavigation';
import { AppLoading } from 'expo';
import { Unsubscribe } from 'redux';
import { store } from './app/redux/store';
import { UserModel } from './app/models/userModel';
import AuthContext from './app/auth/context';
import storage from './app/auth/storage';
import { ActionType } from './app/redux/action-type';
import JwtDecode from 'jwt-decode';
import TokenHandler from './app/auth/TokenHandler';


interface AppState {
  fontsLoaded: boolean
  user: UserModel
  isReady: boolean
}

export class App extends React.Component<{ props: any }, AppState> {
  navigationSubscription: any;
  static contextType = AuthContext;
  private UnsubscribeStore: Unsubscribe;
  constructor(props: any) {
    super(props)
    this.state = {
      isReady: false,
      user: new UserModel(),
      fontsLoaded: false
    }
    this.UnsubscribeStore = store.subscribe(() => { })
  }


  async componentDidMount() {
    store.dispatch({ type: ActionType.CleanCreator })
    await TokenHandler().then(user => {
      this.setState({ user })
    });
    Font.loadAsync({
      'KumbhSans-Light': require('./assets/fonts/KumbhSans-Light.ttf')
    }
    ).then(() => this.setState({ fontsLoaded: true }))
  }

  componentWillUnmount() {
    this.UnsubscribeStore()
  }

  setUser = (user: UserModel) => {
    this.setState((prevState) => ({ user }))
  }


  render() {
    const user = this.state.user
    const { setUser } = this
    return (
      <SafeAreaView style={styles.container}>
        {!this.state.isReady ? <AppLoading startAsync={TokenHandler} onFinish={() => this.setState({ isReady: true })} /> :
          <AuthContext.Provider value={{ user, setUser }}>
            {!this.state.fontsLoaded ? <AppLoading /> :
              <NavigationContainer theme={navigationTheme}>
                {user ? <AppNavigator /> : <AuthNavigator />}
              </NavigationContainer>}
          </AuthContext.Provider>}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default App;

