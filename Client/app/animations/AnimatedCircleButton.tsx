import React, { Component } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { Dimensions } from 'react-native';
import { Animated } from 'react-native';
import { View, StyleSheet, Easing, TouchableOpacity } from 'react-native';
import { Config } from '../../config';
import { AppText } from '../components/AppText'
import { Colors } from '../config/colors';
import { Image } from "react-native-expo-image-cache"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

interface Props {
    direction: string;
    onPress: Function;
    upperWord: string;
    bottomWord: string;
}

const { height, width } = Dimensions.get('window')

export function AnimatedCircleButton({ onPress, direction, bottomWord, upperWord }: Props) {
    const navigation = useNavigation()
    const circleRef = useRef(new Animated.Value(0)).current;
    const scaleRef = useRef(new Animated.Value(0)).current;
    const opacityRef = useRef(new Animated.Value(0)).current;

    const [colorImg, setColorImg] = useState<string>('')
    const [startUp, setStartUp] = useState(true);


    useEffect(() => {
        const unsubscribeFocus = navigation.addListener('focus', () => startUpFunc())
        const unsubscribeLeave = navigation.addListener('blur', () => killAnimations())
        startUpFunc()
        return () => {
            unsubscribeFocus()
            unsubscribeLeave()
        }
    }, [])

    const killAnimations = () => {
        scaleRef.setValue(0)
        circleRef.setValue(0)
    }

    const startUpFunc = async () => {
        const colorScheme = await AsyncStorage.getItem('colorScheme');
        if (colorScheme && (colorScheme === 'light' || colorScheme === 'firstUse')) {
            setColorImg('lightModeAnimatedRunes.png')
        } else {
            setColorImg('darkModeAnimatedRunes.png')
        }
        spinCircle()
        setTimeout(() => {
            setStartUp(false)
            opacityCircle()
        }, 700);

    }

    const spinCircle = () => {
        Animated.parallel([
            Animated.loop(
                Animated.timing(
                    circleRef,
                    {
                        toValue: 1,
                        duration: 20000,
                        easing: Easing.linear,
                        useNativeDriver: true
                    }
                )
            ),
            Animated.timing(scaleRef, {
                toValue: 1,
                duration: 450,
                delay: 250,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ]).start();
    }

    const opacityCircle = () => {
        Animated.timing(opacityRef,
            {
                toValue: 1,
                duration: 200,
                easing: Easing.linear,
                useNativeDriver: true
            }).start()
    }

    const scaleCircle = () => {
        scaleRef.setValue(0)
        Animated.timing(scaleRef,
            {
                toValue: 1,
                duration: 250,
                easing: Easing.linear,
                useNativeDriver: true
            }).start()
    }


    const rotate = circleRef.interpolate({
        inputRange: [0, 1],
        outputRange: direction === 'left' ? ['0deg', '-360deg'] : ['0deg', '360deg']
    })


    const opacity = opacityRef.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
    })

    const scale = scaleRef.interpolate({
        inputRange: [0, .5, 1],
        outputRange: startUp ? [0, .5, 1] : [1, .8, 1]
    })

    const clickButton = () => {
        scaleCircle()
        setTimeout(() => {
            onPress()
        }, 250);

    }

    return (
        <TouchableOpacity style={styles.container} onPress={() => clickButton()}>
            <Animated.View style={[styles.circle, {
                transform: [{ scale }, { rotate }]
            }]}>
                <Image uri={`${Config.serverUrl}/assets/misc/animated/${colorImg}`} style={{ width: width / 2.2, height: width / 2.2 }} />
            </Animated.View>
            <Animated.View style={[styles.text, { opacity }]}>
                <AppText fontSize={20} color={Colors.bitterSweetRed}>{upperWord}</AppText>
                <AppText fontSize={20} color={Colors.bitterSweetRed}>{bottomWord}</AppText>
            </Animated.View>

        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        width: width / 2.2,
        height: width / 2.2,
        position: 'relative',
    },
    text: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center',
    },
    circle: {
        width: width / 2.2, height: width / 2.2,
        position: 'absolute'
    }
});