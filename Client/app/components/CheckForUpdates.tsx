import React, { Component } from 'react';
import { View, StyleSheet, Image, Platform, StatusBar } from 'react-native';
import { AppActivityIndicator } from './AppActivityIndicator';
import { AppText } from './AppText';
import { CheckForUpdatesAnimation } from '../animations/CheckForUpdatesAnimation'
import Constants from 'expo-constants';

export class CheckForUpdates extends Component {
    render() {
        return (
            <View style={styles.container}>
                <CheckForUpdatesAnimation />
                <View style={{ zIndex: 10, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require("../../assets/noInternetDragon.png")} style={{ width: 150, height: 150 }} />
                    <AppText>DnCreate is checking for updates...</AppText>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center"
    }
});