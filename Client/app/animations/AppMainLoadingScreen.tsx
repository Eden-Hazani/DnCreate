import React, { Component } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';

export class AppMainLoadingScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image style={{
                    alignSelf: 'center',
                    height: '100%',
                    width: '100%'
                }} source={require('../../assets/app_main_loading.gif')} resizeMode={'contain'} />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F76C5E"
    }
});