import React, { useEffect, useState, } from 'react';
import { Dimensions, Easing, View, StyleSheet } from "react-native";
import { Image } from 'react-native-expo-image-cache';
import Animated from "react-native-reanimated";
import { Config } from '../../config';


const TextLogo = () => {
    useEffect(() => {
        startAnimation()
    }, [])
    const [animation, setAnimation] = useState(new Animated.Value(0))
    const startAnimation = () => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 400,
            easing: Easing.linear as any
        }).start()
    }
    const opacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
    })
    const top = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 120]
    })
    const fontSize = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 70]
    })
    return (
        <View style={{
            position: "absolute", justifyContent: 'center', alignItems: 'center',
            right: 0, left: 0, bottom: 0, top: 10
        }}>
            <Animated.Text style={{
                fontFamily: 'KumbhSans-Light',
                fontSize, top, opacity, color: '#fce180'
            }}
            >DnCreate</Animated.Text>

        </View>
    )
}


export function StartAnimation() {
    useEffect(() => {
        setTimeout(() => {
            setTimer(true)
        }, 1200);
    }, [])
    const [timer, setTimer] = useState(false)
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
            <Image uri={`${Config.serverUrl}/assets/core/startLoadGif.gif`} style={{ width: 250, height: 250, top: -50 }} />
            {timer && <TextLogo />}
        </View>
    )
}