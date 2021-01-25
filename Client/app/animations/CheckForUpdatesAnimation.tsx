import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Platform, StyleSheet, Text, View, StatusBar } from 'react-native';
import Constants from 'expo-constants';
import { Colors } from '../config/colors';


const Circle = ({ animatedValue }: any) => {
    const inputRange = [0, 0.001, 0.5, 0.501, 1];
    const bgColor = animatedValue.interpolate({
        inputRange,
        outputRange: [Colors.bitterSweetRed, Colors.bitterSweetRed, Colors.bitterSweetRed, Colors.totalWhite, Colors.totalWhite]
    })
    const circleBg = animatedValue.interpolate({
        inputRange,
        outputRange: [Colors.totalWhite, Colors.totalWhite, Colors.totalWhite, Colors.bitterSweetRed, Colors.bitterSweetRed]
    });
    return (
        <Animated.View style={[StyleSheet.absoluteFillObject, styles.container, { backgroundColor: bgColor }]}>
            <Animated.View style={[styles.circle, {
                backgroundColor: circleBg,
                transform: [
                    {
                        perspective: 300
                    },
                    {
                        rotateY: animatedValue.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: ['0deg', '-90deg', '-180deg']
                        })
                    },
                    {
                        scale: animatedValue.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [1, 5.5, 1]
                        })
                    },
                    {
                        translateX: animatedValue.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [1, 5.5, 1]
                        })
                    }
                ]
            }]}>
            </Animated.View>
        </Animated.View>
    )
}

export function CheckForUpdatesAnimation() {
    useEffect(() => {
        runAnimation()
    }, [])

    const runAnimation = () => {
        Animated.loop(Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: false
            }),
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 3000,
                useNativeDriver: false
            })
        ])).start()
    }

    const animatedValue = React.useRef(new Animated.Value(0)).current;

    return <View style={styles.container}>
        <Circle animatedValue={animatedValue} />
    </View>
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 8,
        paddingBottom: 50,
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
});