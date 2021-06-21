import React from 'react';
import { StyleSheet, SafeAreaView, Platform, StatusBar, View, Modal } from 'react-native';
import 'react-native-gesture-handler';
import { Unsubscribe } from 'redux';
import { store } from './app/redux/store';
import { UserModel } from './app/models/userModel';
import AuthContext, { AuthProvider } from './app/auth/context';
import AppLoading from 'expo-app-loading';
import { Config } from './config';
import { Colors } from './app/config/colors';
import { I18nManager } from "react-native";
import { StartAnimation } from './app/animations/StartAnimation';
import logger from './utility/logger';
import * as Facebook from 'expo-facebook';
import { CheckForUpdates } from './app/components/CheckForUpdates';
import * as Notifications from 'expo-notifications';
import startUp from './utility/core/appStartUp'
import updateCheck from './utility/core/checkForUpdates';
import { AuthenticationGate } from './AuthenticationGate';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  fontsLoaded: boolean;
  user: UserModel;
  AppMainLoadAnimation: boolean;
  colorScheme: boolean;
  lookingForUpdates: boolean;
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
      AppMainLoadAnimation: false,
      user: new UserModel(),
      fontsLoaded: false,
      colorScheme: false,
      lookingForUpdates: false,
    }

    this.UnsubscribeStore = store.subscribe(() => {
      this.setState({ user: store.getState().user, colorScheme: store.getState().colorScheme })
    })
    this.bannerAd = Platform.OS === 'ios' ? Config.iosBanner : Config.androidBanner
    this.facebookBannerAd = Config.facebookBannerAd
  }

  loadApp = async () => {
    try {
      const { AppMainLoadAnimation, fontsLoaded } = await startUp();
      this.setState({ AppMainLoadAnimation, fontsLoaded }, () => {
        setTimeout(async () => {
          this.setState({ AppMainLoadAnimation: false })
        }, 2300);
      })
    } catch (err) {
      logger.log(err)
    }
  }

  async componentDidMount() {
    logger.start();
    try {
      if (!__DEV__) {
        this.setState({ lookingForUpdates: true })
        await updateCheck((resolve: boolean) => {
          this.setState({ lookingForUpdates: resolve }, () => this.loadApp());
        });
        return;
      }
      this.loadApp();
    } catch (err) {
      logger.log(new Error(err))
    }
  }


  componentWillUnmount() {
    this.UnsubscribeStore()
  }

  componentDidCatch(error: any, info: any) {
    const errorObject = { error, info }
    logger.log(new Error('Component Catch Error'))
    logger.log(new Error(JSON.stringify(errorObject)))
  }

  render() {

    return (
      <View style={{ flex: 1 }}>
        {this.state.lookingForUpdates ?
          <CheckForUpdates />
          :
          <SafeAreaView style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
            <View style={{ flex: 1 }}>
              <AuthProvider >
                <Provider store={store}>
                  {this.state.AppMainLoadAnimation ?
                    <StartAnimation />
                    :
                    !this.state.fontsLoaded ? <AppLoading /> :
                      <AuthenticationGate />
                  }
                </Provider>
              </AuthProvider>
            </View>
          </SafeAreaView>
        }
      </View>
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

