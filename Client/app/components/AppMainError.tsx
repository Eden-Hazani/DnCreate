import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { AppText } from './AppText';

export class AppMainError extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../../assets/errorDragon.png')} style={{ height: 150, width: 150 }} />
                <AppText textAlign={'center'} fontSize={30}>Oops..</AppText>
                <AppText textAlign={'center'} fontSize={22}>Seems like DnCreate crashed.</AppText>
                <AppText textAlign={'center'} fontSize={17}>An Error report has been send and we will get on patching this annoying bug right away.</AppText>
                <AppText textAlign={'center'} fontSize={17}>Try resting the app.</AppText>
                <AppText textAlign={'center'} fontSize={17}>Thank you for using DnCreate.</AppText>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        paddingTop: 70,
        justifyContent: "center",
        alignItems: "center"
    }
});