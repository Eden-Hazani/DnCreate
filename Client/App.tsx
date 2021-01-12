import React from 'react';
import { StyleSheet, SafeAreaView, Platform, StatusBar, View, Image, Modal, Alert } from 'react-native';
import 'react-native-gesture-handler';
import * as Font from 'expo-font'
import { NavigationContainer } from '@react-navigation/native'
import navigationTheme from './app/navigators/navigationTheme';
import AppNavigator from './app/navigators/AppNavigator';
import AuthNavigator from './app/navigators/AuthNavigation';
import { Unsubscribe } from 'redux';
import { store } from './app/redux/store';
import { UserModel } from './app/models/userModel';
import AuthContext from './app/auth/context';
import storage from './app/auth/storage';
import AppLoading from 'expo-app-loading';
import { ActionType } from './app/redux/action-type';
import JwtDecode from 'jwt-decode';
import TokenHandler from './app/auth/TokenHandler';
import { AdMobBanner, AdMobInterstitial } from 'expo-ads-admob'
import { Config } from './config';
import authApi from './app/api/authApi';
import errorHandler from './utility/errorHander';
import AsyncStorage from '@react-native-community/async-storage';
import { Colors } from './app/config/colors';
import { I18nManager } from "react-native";
import { StartAnimation } from './app/animations/StartAnimation';
import OfflineNavigator from './app/navigators/OfflineNavigator';
import * as Updates from 'expo-updates';
import logger from './utility/logger';
import * as Facebook from 'expo-facebook';
import MainAds from './app/Ads/MainAds';
import { AppText } from './app/components/AppText';
import { CheckForUpdates } from './app/components/CheckForUpdates';
import * as Notifications from 'expo-notifications';
import { navigationRef } from './app/navigators/rootNavigation';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

Facebook.initializeAsync({ appId: "118004343480971", appName: "DnCreate" });

interface AppState {
  fontsLoaded: boolean
  user: UserModel
  isReady: boolean
  AppMainLoadAnimation: boolean
  colorScheme: boolean
  offLineMode: boolean
  bannerCallTime: boolean
  lookingForUpdates: boolean
}

export class App extends React.Component<{ props: any, navigation: any }, AppState> {
  public bannerAd: string;
  public facebookBannerAd: string
  navigationSubscription: any;
  static contextType = AuthContext;
  private UnsubscribeStore: Unsubscribe;
  constructor(props: any) {
    super(props)
    this.state = {
      bannerCallTime: false,
      offLineMode: false,
      AppMainLoadAnimation: false,
      isReady: false,
      user: new UserModel(),
      fontsLoaded: false,
      colorScheme: false,
      lookingForUpdates: false
    }
    this.UnsubscribeStore = store.subscribe(() => {
      this.setState({ user: store.getState().user, colorScheme: store.getState().colorScheme })
    })
    this.bannerAd = Platform.OS === 'ios' ? Config.iosBanner : Config.androidBanner
    this.facebookBannerAd = Config.facebookBannerAd
  }

  checkForUpdates = () => {
    try {
      this.setState({ lookingForUpdates: true }, async () => {
        const updates = await Updates.checkForUpdateAsync();
        if (updates.isAvailable) {
          Alert.alert("New Update", "DnCreate has a new update, would you like to download it?",
            [{
              text: 'Yes', onPress: async () => {
                Updates.fetchUpdateAsync().then(() => {
                  Updates.reloadAsync();
                }).catch(() => {
                  this.setState({ lookingForUpdates: false })
                  this.loadApp()
                })
              }
            }, {
              text: 'No', onPress: () => {
                this.setState({ lookingForUpdates: false })
                this.loadApp()
              }
            }])
        } else if (!updates.isAvailable) {
          this.setState({ lookingForUpdates: false })
          this.loadApp()
        }
      })
    } catch (err) {
      logger.log(new Error('Error in updates'))
      logger.log(new Error(err))
    }
  }


  loadApp = async () => {
    try {
      this.loadColors().then(async () => {
        store.dispatch({ type: ActionType.CleanCreator })
        await TokenHandler().then(async (user) => {
          if (user !== null && user._id !== "Offline") {
            this.setState({ user }, async () => {
              const result = await authApi.isUserLogged();
              if (!result.ok) {
                errorHandler(result);
                return;
              }
            })
          }
          if (user === null) {
            const isOffline = await AsyncStorage.getItem("isOffline");
            const offlineUser: any = { username: 'Offline', activated: true, _id: 'Offline', password: undefined, profileImg: undefined, premium: false }
            if (isOffline) {
              if (JSON.parse(isOffline)) {
                store.dispatch({ type: ActionType.SetUserInfo, payload: offlineUser })
                this.setState({ user: offlineUser })
              }
            }
          }
          Font.loadAsync({
            'KumbhSans-Light': require('./assets/fonts/KumbhSans-Light.ttf')
          }).then(() => this.setState({ fontsLoaded: true, AppMainLoadAnimation: true }, () => {
            setTimeout(() => {
              this.setState({ AppMainLoadAnimation: false, bannerCallTime: true })
            }, 2300);
          }))
        })
      })
    } catch (err) {
      console.log(err.message)
    }
  }


  async componentDidMount() {
    logger.start();
    try {
      if (!__DEV__) {
        this.checkForUpdates()
        return;
      }
      this.loadApp()
    } catch (err) {
      logger.log(new Error(err))
    }
  }

  loadColors = async () => {
    let colorScheme = await AsyncStorage.getItem('colorScheme');
    if (colorScheme === null || colorScheme === "firstUse") {
      await AsyncStorage.setItem("colorScheme", "firstUse")
      colorScheme = "firstUse"
      Colors.InitializeAsync()
      store.dispatch({ type: ActionType.colorScheme, payload: false })
      return
    }
    store.dispatch({ type: ActionType.colorScheme, payload: colorScheme === "light" ? false : true })
  }

  componentWillUnmount() {
    this.UnsubscribeStore()
  }

  setUser = (user: UserModel) => {
    this.setState((prevState) => ({ user }))
  }


  isUserLogged = async () => {
    const isOffline = await AsyncStorage.getItem('isOffline');
    if (isOffline) {
      if (JSON.parse(isOffline)) {
        return;
      }
    }
    const result = await authApi.isUserLogged();
    if (result.status === 403) {
      errorHandler(result);
      return;
    }
  }


  pickBannerAd = () => {
    if (this.state.user && this.state.user._id && this.state.user.premium) {
      return <View></View>
    }
  }

  componentDidCatch(error: any, info: any) {
    const errorObject = { error, info }
    logger.log(new Error('Component Catch Error'))
    logger.log(new Error(JSON.stringify(errorObject)))
  }

  render() {
    const user = this.state.user
    const { setUser } = this
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
        {this.state.lookingForUpdates ?
          <CheckForUpdates />
          :
          <View style={{ flex: 1 }}>
            {!this.state.isReady ? <AppLoading onError={(error) => { logger.log(error) }} startAsync={TokenHandler} onFinish={() => this.setState({ isReady: true })} /> :
              <AuthContext.Provider value={{ user, setUser }}>
                {this.state.AppMainLoadAnimation ?
                  <StartAnimation />
                  :
                  !this.state.fontsLoaded ? <AppLoading /> :
                    <NavigationContainer ref={navigationRef} onStateChange={() => this.isUserLogged()} theme={navigationTheme}>
                      {(user && user._id === "Offline" && <OfflineNavigator />) || (user && user.username ? <AppNavigator /> : <AuthNavigator />)}
                    </NavigationContainer>
                }
              </AuthContext.Provider>}
            {this.state.bannerCallTime && <View>{
              this.state.user && this.state.user._id && this.state.user.premium ? <View></View>
                :
                <MainAds adMobBannerId={this.bannerAd} faceBookBannerId={this.facebookBannerAd} />
            }</View>}
          </View>
        }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default App;

