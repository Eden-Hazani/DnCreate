import React, { Component } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import colors from '../config/colors';

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
        backgroundColor: colors.bitterSweetRed
    }
});