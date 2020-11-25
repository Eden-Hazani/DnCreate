import React, { useEffect, useState, } from 'react';
import { Dimensions, Easing, Image, View, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { Colors } from "../config/colors";
const { width, height } = Dimensions.get('screen');

const BackDrop = () => {
    useEffect(() => {
        startAnimation()
        setTimeout(() => {
            startAnimation()
        }, 400);
        setTimeout(() => {
            startAnimation()
        }, 800);
    }, [])
    const [animation, setAnimation] = useState(new Animated.Value(0))
    const startAnimation = () => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 400,
            easing: Easing.linear as any
        }).start()
        animation.setValue(0)
    }
    const translateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1000]
    })
    return <Animated.View
        style={{
            backgroundColor: "#F76C5E",
            width: width,
            height: height + 250,
            top: -100, left: -height * 0.6,
            position: 'absolute',
            transform: [{
                translateX
            },
            { rotate: "-15deg" }]
        }}>
    </Animated.View>
}

const LogoAnimation = () => {
    useEffect(() => {
        startAnimation()
    }, [])
    const [animation, setAnimation] = useState(new Animated.Value(0))
    const startAnimation = () => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear as any
        }).start()
    }
    const widthAnim = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200],
    })
    return (
        <Animated.Image source={require('../../assets/logo.png')} style={{
            resizeMode: "contain", justifyContent: "center", alignSelf: "center", width: widthAnim
        }} />
    )
}


const BackColor = () => {
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
    const translateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 500]
    })
    return <Animated.View
        style={{
            backgroundColor: "#F76C5E",
            width: width + 250,
            height: height + 250,
            top: -110, left: -height * 0.8,
            position: 'absolute',
            transform: [{
                translateX
            },
            { rotate: "-15deg" }]
        }}>
    </Animated.View>
}

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
            right: 0, left: 0, bottom: 0, top: 0
        }}>
            <Animated.Text style={{
                fontSize, top, opacity, color: 'black'
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
        <View>
            <BackDrop />
            {timer && <BackColor />}
            {timer && <TextLogo />}
            <LogoAnimation />
        </View>
    )
}