import React, { Component } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, LayoutAnimation, Easing, TouchableOpacity, ScrollView } from 'react-native';
import { ListItemSeparator } from './ListItemSeparator';
import { AppText } from './AppText';
import { Colors } from '../config/colors';

interface Props {
    isOpen: boolean;
    infoList: string[];
    pickText: Function;
    inputtedText: string
}

export function SearchableTextDropDown({ isOpen, infoList, pickText, inputtedText }: Props) {
    const [animationStatus, setAnimationStatus] = useState(new Animated.ValueXY({ x: -1000, y: 0 }))
    const [drawerStatus, setDrawerStatus] = useState(isOpen)
    useEffect(() => {
        setDrawerStatus(isOpen)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        isOpen ? changeAnimation(true) : changeAnimation(false)
    }, [inputtedText, isOpen])

    const changeAnimation = (status: boolean) => {
        Animated.timing(animationStatus, {
            toValue: ({ x: status ? 0 : -Dimensions.get('window').width, y: 0 }),
            duration: 250,
            useNativeDriver: false,
            easing: Easing.linear as any
        }).start()
    }

    const expendedStyle = () => {
        return {
            width: Dimensions.get('window').width / 1.2,
            height: '100%',
            maxHeight: 250
        }
    }

    const searchInfo = () => {
        if (inputtedText !== '') {
            let newInfoArray: string[] = [];
            for (let item of infoList) {
                if (item.toLowerCase().includes(inputtedText.toLowerCase())) newInfoArray.push(item)
            }
            return newInfoArray
        }
        return infoList
    }

    return (
        <View style={[styles.container, { display: isOpen ? 'flex' : 'none', flex: 1 }]}>
            <View style={[styles.box, drawerStatus ? expendedStyle() : undefined, { backgroundColor: Colors.metallicBlue }]}>
                <Animated.View style={[animationStatus.getLayout(), { padding: 25, height: '100%' }]}>
                    <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps={"always"}>
                        {searchInfo().map((item: any, index: number) => <View key={index}>
                            <TouchableOpacity onPress={() => pickText(item)}
                                style={{ borderColor: Colors.totalWhite, borderWidth: 1, borderRadius: 25, padding: 10, margin: 1 }}>
                                <AppText color={Colors.totalWhite}>{item}</AppText>
                            </TouchableOpacity>
                            <ListItemSeparator />
                        </View>
                        )}
                    </ScrollView>
                </Animated.View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    box: {
        zIndex: 30,
        height: 50,
        borderRadius: 25,
        width: 200,
    }
});