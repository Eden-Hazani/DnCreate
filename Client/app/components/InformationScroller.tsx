import AsyncStorage from '@react-native-community/async-storage';
import React, { Component, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, Animated, } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { AppButton } from './AppButton';
import { AppText } from './AppText';
import { Colors } from '../config/colors';


const { width, height } = Dimensions.get('window')
const Indicator = ({ scrollY, items }: any) => {
    return (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: "flex-end", zIndex: 40, width: 30 }}>
            {items.map((_: any, i: any) => {
                const inputRange = [(i - 1) * height, i * height, (i + 1) * height]
                const scale: any = scrollY.interpolate({
                    inputRange,
                    outputRange: [0.8, 1.4, 0.8],
                    extrapolate: 'clamp'
                })
                const opacity: any = scrollY.interpolate({
                    inputRange,
                    outputRange: [0.4, 0.9, 0.6],
                    extrapolate: 'clamp'
                })
                return <Animated.View key={`indicator-${i}`}
                    style={{
                        height: 10, width: 10, borderRadius: 5,
                        backgroundColor: Colors.bitterSweetRed, margin: 10,
                        transform: [{ scale }],
                        opacity
                    }}>

                </Animated.View>
            })}
        </View>
    )
}

const Item = ({ scrollY, index, headline, leftTextBlock, rightTextBlock, ImgUrl, finishButton, PressClose }: any) => {
    const inputRange = [(index - 1) * 1, index * height, (index + 1) * height];
    const scale = scrollY.interpolate({
        inputRange,
        outputRange: [0, 1, 0]
    })
    const translateYHeadline = scrollY.interpolate({
        inputRange,
        outputRange: [height / 2, 0, height / 2]
    })
    const translateXRTB = scrollY.interpolate({
        inputRange,
        outputRange: [-width, 0, -width]
    })
    console.log(translateXRTB)
    const translateXLTB = scrollY.interpolate({
        inputRange,
        outputRange: [width, 0, +width]
    })
    const opacity: any = scrollY.interpolate({
        inputRange,
        outputRange: [0, 1, 0],
        extrapolate: 'clamp'
    })

    return (
        <View style={[styles.itemStyle, {
            backgroundColor: Colors.pageBackground, flex: 1, width, height: height
        }]}>
            <Animated.Text style={[styles.heading,
            { transform: [{ translateY: translateYHeadline }], color: Colors.bitterSweetRed }
            ]}>{headline.replace(' ', '\n')}</Animated.Text>
            <Animated.Text style={[styles.description,
            { transform: [{ translateX: translateXLTB }], lineHeight: 25, paddingBottom: 10, color: Colors.whiteInDarkMode }
            ]}>{leftTextBlock}</Animated.Text>
            <Animated.Text style={[styles.description,
            { transform: [{ translateX: translateXRTB }], lineHeight: 25, color: Colors.whiteInDarkMode }
            ]}>{rightTextBlock}</Animated.Text>
            {finishButton &&
                <Animated.View style={{ paddingTop: 40 }}>
                    <AppButton color={Colors.white} title={"Let's Start!"} width={120} height={70} fontSize={22} backgroundColor={Colors.bitterSweetRed}
                        borderRadius={20} onPress={async () => {
                            setTimeout(() => {
                                PressClose(false)
                            }, 300);
                        }} />
                </Animated.View>
            }
            <Animated.View style={{ opacity, paddingTop: 15, transform: [{ scale: scale }] }}>
                <Image uri={ImgUrl} style={{ width: 250, height: 250 }} />
            </Animated.View>
        </View >
    )
}



export default function InformationScroller({ PressClose, list }: any) {
    const scrollY = React.useRef(new Animated.Value(0)).current
    return (
        <View style={styles.container}>
            <Animated.FlatList
                style={{ zIndex: 10, flex: 1 }}
                keyExtractor={(item: any, index: any) => index.toString()}
                data={list}
                decelerationRate={0.87}
                snapToAlignment={"start"}
                pagingEnabled={true}
                snapToInterval={Dimensions.get('window').height}
                renderItem={({ item, index }: any) => <Item {...item} index={index} scrollY={scrollY} PressClose={PressClose} />}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEnabled={true}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            />
            <Indicator scrollY={scrollY} items={Object.values(list)} />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        zIndex: 10,
        flex: 1,
        height
    },
    itemStyle: {
        flex: 1,
        alignItems: "center",
    },
    textContainer: {
        alignItems: 'center',
        alignSelf: "center",
        paddingLeft: 15,
    },
    heading: {
        textAlign: "center",
        fontFamily: "KumbhSans-Light",
        textTransform: 'uppercase',
        fontSize: width / 10,
        fontWeight: '800',
        letterSpacing: 3,
        marginBottom: 10,
    },
    description: {
        color: Colors.bitterSweetRed,
        fontFamily: "KumbhSans-Light",
        textAlign: 'center',
        width: width * 0.85,
        fontSize: width / 17,
    },
});