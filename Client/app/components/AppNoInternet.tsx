import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { AppText } from './AppText';

export class AppNoInternet extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../../assets/noInternetDragon.png')} style={{ width: 250, height: 250 }} />
                <AppText padding={15} textAlign={'center'} fontSize={25}>No Internet Connection :(</AppText>
                <AppText padding={8} textAlign={'center'} fontSize={18}>At this time DnCreate requires a working internet connection.</AppText>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center"
    }
});