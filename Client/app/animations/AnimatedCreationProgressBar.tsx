import React, { Component, useState } from 'react';
import { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducer';
import { AppActivityIndicator } from '../components/AppActivityIndicator'
import * as Progress from 'react-native-progress';
import { Colors } from '../config/colors';
import { AppConfirmation } from '../components/AppConfirmation';
import { useRef } from 'react';

export function AnimatedCreationProgressBar() {
    const [prevProgress, setPrevProgress] = useState<number>(-1)
    const currentProgress = useSelector((state: RootState) => { return state.creationProgressBarValue });
    const animationRef = useRef(new Animated.Value(0)).current
    useEffect(() => {
        if (prevProgress < currentProgress) {
            animateProgress()
        }
        setPrevProgress(currentProgress)
    }, [currentProgress])

    const animateProgress = () => {
        Animated.parallel([
            Animated.sequence([
                Animated.timing(animationRef, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: false,
                    easing: Easing.linear
                }),
                Animated.timing(animationRef, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: false,
                    easing: Easing.linear
                })
            ])
        ]).start()
    }
    const width = animationRef.interpolate({
        inputRange: [0, 1],
        outputRange: [Dimensions.get('window').height / 2.2, Dimensions.get('window').height / 1.8]
    })
    const translateY = animationRef.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 20]
    })
    return (
        <View style={styles.container}>
            <Animated.View style={{
                transform: [{ rotateZ: '-90deg' }], position: 'absolute',
                width
            }}>
                <Progress.Bar color={Colors.bitterSweetRed} progress={currentProgress} width={null} />
            </Animated.View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 1,
        height: '100%',
        left: 5
    }
});