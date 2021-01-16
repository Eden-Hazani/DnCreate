import React, { Component, useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Easing, LayoutAnimation, TouchableOpacity, Platform, UIManager } from 'react-native';
import { Colors } from '../config/colors';
import { AppText } from './AppText';
import { IconGen } from './IconGen';

if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function InformationDrawer({ expendedWidth, expendedHeight, information }: any) {
    const [animationStatus, setAnimationStatus] = useState(new Animated.ValueXY({ x: -1000, y: 0 }))
    const [drawerStatus, setDrawerStatus] = useState(false)
    const handlePress = useCallback(() => {
        setDrawerStatus(val => !val);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, []);
    useEffect(() => {
        drawerStatus ? openAnimation() : closeAnimation()
    }, [drawerStatus])
    const expendedStyle = () => {
        return {
            width: expendedWidth,
            height: expendedHeight
        }
    }
    const openAnimation = () => {
        Animated.timing(animationStatus, {
            toValue: ({ x: 0, y: 0 }),
            duration: 400,
            useNativeDriver: false,
            easing: Easing.linear as any
        }).start()
    }
    const closeAnimation = () => {
        Animated.timing(animationStatus, {
            toValue: ({ x: -1000, y: 0 }),
            duration: 400,
            useNativeDriver: false,
            easing: Easing.linear as any
        }).start()
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePress}>
                <View style={[styles.box, drawerStatus ? expendedStyle() : undefined, { backgroundColor: Colors.burgundy }]}>
                    {!drawerStatus ?
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <AppText color={Colors.totalWhite}>More Information</AppText>
                            <IconGen name={'chevron-double-right'} size={50} iconColor={Colors.totalWhite} />
                        </View>
                        :
                        <Animated.View style={[animationStatus.getLayout(), { padding: 25 }]}>
                            <AppText color={Colors.totalWhite}>{information.replace(/\. /g, '.\n\n')}</AppText>
                        </Animated.View>
                    }
                </View>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

    },
    box: {
        height: 50,
        borderRadius: 25,
        width: 200
    },
});