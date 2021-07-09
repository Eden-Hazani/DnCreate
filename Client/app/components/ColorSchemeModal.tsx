import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../config/colors';
import { AppText } from '../components/AppText'
import { TouchableOpacity } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActionType } from '../redux/action-type';
import { store } from '../redux/store';
import { useEffect } from 'react';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../config';

interface Props {
    closeModal: Function
}

export function ColorSchemeModal({ closeModal }: Props) {
    const [colorMode, setColorMode] = useState<boolean>(true)

    useEffect(() => {
        switchMode()
    }, [colorMode])

    const switchMode = async () => {
        const color = colorMode ? "light" : "dark"
        await AsyncStorage.setItem('colorScheme', color).then(() => {
            Colors.InitializeAsync().then(() => {
                store.dispatch({ type: ActionType.colorScheme, payload: colorMode })
            })
        });
    }

    const finish = async () => {
        const colorScheme = await AsyncStorage.getItem("colorScheme");
        if (colorScheme === "firstUse") {
            await AsyncStorage.setItem('colorScheme', "light").then(() => {
                Colors.InitializeAsync().then(() => {
                    store.dispatch({ type: ActionType.colorScheme, payload: false })
                    closeModal()
                })
            });
            return;
        }
        closeModal()
    }

    return (
        <View style={[{ backgroundColor: Colors.pageBackground }, styles.container]}>
            <View style={{ flex: 0.1, paddingTop: 150 }}>
                <AppText textAlign={'center'} fontSize={22} color={Colors.whiteInDarkMode}>Tap to pick your style.</AppText>
            </View>
            <View style={{ flex: 0.6 }}>
                {colorMode ?
                    <TouchableOpacity onPress={() => setColorMode(false)}>
                        <Image uri={`${Config.serverUrl}/assets/specificDragons/lightModeDragon.png`} style={{ width: 300, height: 300 }} />
                        <AppText textAlign={'center'} color={Colors.bitterSweetRed} fontSize={22}>Let there be Light</AppText>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => setColorMode(true)}>
                        <Image uri={`${Config.serverUrl}/assets/specificDragons/darkModeDragon.png`} style={{ width: 300, height: 300 }} />
                        <AppText textAlign={'center'} color={Colors.bitterSweetRed} fontSize={22}>To The Darkness we descend</AppText>
                    </TouchableOpacity>}
            </View>
            <View style={{ flex: 0.3 }}>
                <TouchableOpacity onPress={() => finish()}
                    style={[{ backgroundColor: Colors.bitterSweetRed }, styles.button]}>
                    <AppText>O.K</AppText>
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        padding: 25,
        paddingLeft: 35,
        paddingRight: 35,
        borderRadius: 15
    }
});