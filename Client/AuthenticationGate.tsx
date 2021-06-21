import { NavigationContainer } from '@react-navigation/native';
import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MainAds from './app/Ads/MainAds';
import useAuthContext from './app/hooks/useAuthContext';
import AppNavigator from './app/navigators/AppNavigator';
import AuthNavigator from './app/navigators/AuthNavigation';
import navigationTheme from './app/navigators/navigationTheme';
import OfflineNavigator from './app/navigators/OfflineNavigator';
import { navigationRef } from './app/navigators/rootNavigation';
import { Config } from './config';
import isUserConnected from './utility/core/UserLogStatus';

const bannerAd = Platform.OS === 'ios' ? Config.iosBanner : Config.androidBanner
const facebookBannerAd = Config.facebookBannerAd

export function AuthenticationGate() {
    const [bannerCallTime, setBannerCallTime] = useState<boolean>(false)
    const { user } = useAuthContext()

    useEffect(() => {
        setTimeout(() => {
            setBannerCallTime(true)
        }, 1000);
    }, [])

    return (
        <>
            <NavigationContainer ref={navigationRef} onStateChange={() => isUserConnected()} theme={navigationTheme}>
                {(user && user._id === "Offline" && <OfflineNavigator />) || (user && user.username ? <AppNavigator /> : <AuthNavigator />)}
            </NavigationContainer>
            <MainAds adMobBannerId={bannerAd} bannerCallTime={bannerCallTime} faceBookBannerId={facebookBannerAd} user={user} />
        </>
    )
}


const styles = StyleSheet.create({
    container: {

    }
});