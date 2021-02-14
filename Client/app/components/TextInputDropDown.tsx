import React, { Component, useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Easing, LayoutAnimation, TouchableOpacity, Platform, UIManager } from 'react-native';
import { Colors } from '../config/colors';
import { AppText } from './AppText';
import { IconGen } from './IconGen';
import { ListItemSeparator } from './ListItemSeparator';

if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function TextInputDropDown({ sendText, isOpen, expendedWidth, expendedHeight, information }: any) {
    const [animationStatus, setAnimationStatus] = useState(new Animated.ValueXY({ x: -1000, y: 0 }))
    const [drawerStatus, setDrawerStatus] = useState(isOpen)

    useEffect(() => {
        setDrawerStatus(isOpen)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        isOpen ? openAnimation() : closeAnimation()
    }, [isOpen])
    const expendedStyle = () => {
        return {
            width: expendedWidth,
            height: expendedHeight,
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
        <View style={[styles.container, { display: isOpen ? 'flex' : 'none' }]}>
            <View style={[styles.box, drawerStatus ? expendedStyle() : undefined, { backgroundColor: Colors.burgundy }]}>
                <Animated.View style={[animationStatus.getLayout(), { padding: 25 }]}>
                    {information.map((item: any, index: number) => {
                        return <View key={index}>
                            <TouchableOpacity onPress={() => sendText(item)}
                                style={{ borderColor: Colors.black, borderWidth: 1, borderRadius: 25, padding: 10, margin: 1 }}>
                                <AppText>{item}</AppText>
                            </TouchableOpacity>
                            <ListItemSeparator />
                        </View>
                    })}
                </Animated.View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center"
    },
    box: {
        zIndex: 10,
        height: 50,
        borderRadius: 25,
        width: 200
    },
});