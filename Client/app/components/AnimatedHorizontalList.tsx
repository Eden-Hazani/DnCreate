import React, { Component, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { Config } from '../../config';
import racesApi from '../api/racesApi';
import { Colors } from '../config/colors';
import { store } from '../redux/store';
import { AppText } from './AppText';
import { Image } from 'react-native-expo-image-cache';
import { ScrollView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('screen');




const Indicator = ({ scrollX, races }: any) => {
    const { subscribe } = store
    let baseColor = Colors.bitterSweetRed
    useEffect(() => subscribe(
        () => setColor(Colors.bitterSweetRed))
        , [])
    const [newColor, setColor] = useState(baseColor)
    let innerHeight = 0;
    let innerLeft = 0
    return (
        races.map((_: any, i: any) => {
            innerHeight = innerHeight + 30;
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width]
            const scale: any = scrollX.interpolate({
                inputRange,
                outputRange: [0.8, 1.4, 0.8],
                extrapolate: 'clamp'
            })
            const opacity: any = scrollX.interpolate({
                inputRange,
                outputRange: [0.4, 0.9, 0.6],
                extrapolate: 'clamp'
            })
            if (innerHeight >= height - 120) {
                innerHeight = 30;
                innerLeft = width - 30;
            }
            return <View style={{ flexWrap: "wrap", position: 'absolute', top: innerHeight, left: innerLeft }} key={`indicator-${i}`}>
                <Animated.View
                    style={{
                        height: 10, width: 10, borderRadius: 5,
                        backgroundColor: newColor, margin: 10,
                        transform: [{ scale }],
                        opacity
                    }}>
                </Animated.View>
            </View>
        })
        // </View>
    )
}

const BackDrop = ({ scrollX, backDropColors }: any) => {
    const bgs = backDropColors;
    const backgroundColor: any = scrollX.interpolate({
        inputRange: bgs.map((_: any, i: any) => i * Dimensions.get('screen').width),
        outputRange: bgs.map((bg: any) => bg)
    })
    return (
        <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor: backgroundColor }]} />
    )

}

const Square = ({ scrollX }: any) => {
    const { subscribe } = store
    let baseColor = Colors.pageBackground
    useEffect(() => subscribe(
        () => setColor(Colors.pageBackground))
        , [])
    const [newColor, setColor] = useState(baseColor)
    const YOLO = Animated.modulo(Animated.divide(Animated.modulo(scrollX, width), new Animated.Value(width)), 1);
    const rotate = YOLO.interpolate({
        inputRange: [0, .5, 1],
        outputRange: ['-35deg', '0deg', '-35deg']
    })
    const translateX = YOLO.interpolate({
        inputRange: [0, .5, 1],
        outputRange: [0, -height, 0]
    })
    return <Animated.View
        style={{
            width: height, height: height, backgroundColor: newColor, borderRadius: 86, position: 'absolute', top: -height * 0.749, left: -height * 0.2,
            transform: [{
                rotate
            },
            { translateX }]
        }}>

    </Animated.View>
}

export function AnimatedHorizontalList({ onPress, data, backDropColors, loadNextRaceBatch }: any) {
    const scrollX = React.useRef(new Animated.Value(0)).current;
    return (
        <View>
            <BackDrop scrollX={scrollX} backDropColors={backDropColors} />
            <Square scrollX={scrollX} />
            <Animated.FlatList
                onEndReachedThreshold={2}
                onEndReached={() => {
                    loadNextRaceBatch()
                }}
                horizontal
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={32}
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={data}
                keyExtractor={(races: any) => races._id.toString()}
                renderItem={({ item }: any) =>
                    <View style={{ height, width, justifyContent: "center", alignItems: "center", padding: 25 }}>
                        <TouchableOpacity style={{ flex: .3 }} onPress={() => onPress(item)}>
                            <Image uri={item.image ? `${Config.serverUrl}/assets/races/${item.image}` : `${Config.serverUrl}/assets/backgroundDragons/blankDragon.png`} style={{
                                borderRadius: 100, resizeMode: "contain",
                                width: Dimensions.get('screen').scale < 3 ? width / 2.2 : width / 2.5,
                                height: Dimensions.get('screen').scale < 3 ? height / 4.5 : height / 5
                            }} />
                        </TouchableOpacity>
                        <View style={{ flex: .1 }}>
                            <AppText color={Colors.black} fontWeight={"800"} fontSize={25}>{item.name}</AppText>
                        </View>
                        <View style={{ flex: .3 }}>
                            <ScrollView style={{}}>
                                <AppText paddingBottom={110} color={Colors.black} fontSize={17} textAlign={'center'}>{item.description}</AppText>
                            </ScrollView>
                        </View>
                    </View>} />
            <Indicator scrollX={scrollX} races={data} />
        </View>
    )
}