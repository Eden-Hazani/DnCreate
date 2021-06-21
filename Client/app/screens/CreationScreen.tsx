import { useNavigation } from '@react-navigation/native';
import React, { Component, useRef } from 'react';
import { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions, TouchableOpacity } from 'react-native';
import { Image, CacheManager } from "react-native-expo-image-cache"
import { Config } from '../../config';
import { AppText } from '../components/AppText'
import { Colors } from '../config/colors';

const { width, height } = Dimensions.get('window');

export function CreationScreen() {
    const navigation = useNavigation()
    const animateFromUpperRef = useRef(new Animated.Value(0)).current;
    const animateFromBottomRef = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const navSub = navigation.addListener('focus', () => animate())
        return () => { navSub() }
    }, [])

    const animate = () => {
        animateFromUpperRef.setValue(0)
        animateFromBottomRef.setValue(0)
        Animated.parallel([
            Animated.timing(animateFromUpperRef, {
                toValue: 1,
                duration: 450,
                useNativeDriver: false,
                easing: Easing.linear
            }),
            Animated.timing(animateFromBottomRef, {
                toValue: 1,
                duration: 250,
                useNativeDriver: false,
                easing: Easing.linear
            })
        ]).start()
    }
    const leftTranslateX = animateFromUpperRef.interpolate({
        inputRange: [0, .5, 1],
        outputRange: [-width / 1.5, 30, 0]
    })

    const rightTranslateX = animateFromUpperRef.interpolate({
        inputRange: [0, .5, 1],
        outputRange: [width / 1.5, -30, 0]
    })

    const scale = animateFromUpperRef.interpolate({
        inputRange: [0, .7, 1],
        outputRange: [1, .85, 1]
    })
    const bottomTranslateY = animateFromBottomRef.interpolate({
        inputRange: [0, 1],
        outputRange: [height / 2.5, 15]
    })

    const rotateRight = animateFromUpperRef.interpolate({
        inputRange: [0, 1],
        outputRange: ['-45deg', '0deg']
    })

    const rotateLeft = animateFromUpperRef.interpolate({
        inputRange: [0, 1],
        outputRange: ['45deg', '0deg']
    })

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <Animated.View style={{ transform: [{ translateX: leftTranslateX }, { scale }, { rotate: rotateRight }] }}>
                    <TouchableOpacity onPress={() => navigation.navigate('CustomRaceStartScreen')}>
                        <Image uri={`${Config.serverUrl}/assets/specificDragons/raceCreationDragon.png`} style={{ width: 150, height: 150 }} />
                        <AppText color={Colors.earthYellow} fontSize={20} textAlign={'center'}>Race{'\n'}Creator</AppText>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={{ transform: [{ translateX: rightTranslateX }, { scale }, { rotate: rotateLeft }] }}>
                    <TouchableOpacity onPress={() => navigation.navigate('CustomSubClassStart')}>
                        <Image uri={`${Config.serverUrl}/assets/specificDragons/classCreatorDragon.png`} style={{ width: 150, height: 150 }} />
                        <AppText color={Colors.berries} fontSize={20} textAlign={'center'}>SubClass{'\n'}Creator</AppText>
                    </TouchableOpacity>
                </Animated.View>
            </View >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Animated.View style={{ transform: [{ translateY: bottomTranslateY }, { scale }] }}>
                    <TouchableOpacity onPress={() => navigation.navigate('CustomSpellList')}>
                        <Image uri={`${Config.serverUrl}/assets/specificDragons/magicCreatorDragon.png`} style={{ width: 150, height: 150 }} />
                        <AppText color={Colors.metallicBlue} fontSize={20} textAlign={'center'}>Spell{'\n'}Creator</AppText>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    )
}





const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    }
});