import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { AppActivityIndicator } from './AppActivityIndicator';
import { AppText } from './AppText';

export class CheckForUpdates extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image source={require("../../assets/noInternetDragon.png")} style={{ width: 150, height: 150 }} />
                <AppText>DnCreate is checking for updates...</AppText>
                <AppActivityIndicator visible={true} />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        justifyContent: "center",
        alignItems: "center"
    }
});