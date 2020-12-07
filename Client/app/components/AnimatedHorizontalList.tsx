import React, { Component, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { Config } from '../../config';
import racesApi from '../api/racesApi';
import { Colors } from '../config/colors';
import { store } from '../redux/store';
import { AppText } from './AppText';
import { Image } from 'react-native-expo-image-cache';

const { width, height } = Dimensions.get('screen');

const Indicator = ({ scrollX, races }: any) => {
    const { subscribe } = store
    let baseColor = Colors.bitterSweetRed
    useEffect(() => subscribe(
        () => setColor(Colors.bitterSweetRed))
        , [])
    const [newColor, setColor] = useState(baseColor)
    return (
        <View style={{ flexDirection: 'row', position: 'absolute', top: height / 1.3, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
            {races.map((_: any, i: any) => {
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
                return <Animated.View key={`indicator-${i}`}
                    style={{
                        height: 10, width: 10, borderRadius: 5,
                        backgroundColor: newColor, margin: 10,
                        transform: [{ scale }],
                        opacity
                    }}>

                </Animated.View>
            })}
        </View>
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

export function AnimatedHorizontalList({ onPress, data, backDropColors }: any) {
    const scrollX = React.useRef(new Animated.Value(0)).current;
    return (
        <View>
            <BackDrop scrollX={scrollX} backDropColors={backDropColors} />
            <Square scrollX={scrollX} />
            <Animated.FlatList
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
                            <Image uri={`${Config.serverUrl}/assets/${item.image}`} style={{ borderRadius: 100, resizeMode: 'contain', width: width / 1.8, height: height / 4 }} />
                        </TouchableOpacity>
                        <View style={{ flex: .1 }}>
                            <AppText color={Colors.black} fontWeight={"800"} fontSize={25}>{item.name}</AppText>
                        </View>
                        <View style={{ flex: .4 }}>
                            <AppText color={Colors.black} fontSize={17} textAlign={'center'}>{item.description}</AppText>
                        </View>
                    </View>} />
            <Indicator scrollX={scrollX} races={data} />

        </View>
    )
}