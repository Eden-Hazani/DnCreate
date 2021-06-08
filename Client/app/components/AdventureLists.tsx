import React from 'react';
import { Alert, Animated, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../config';
import { Colors } from '../config/colors';
import { AdventureModel } from '../models/AdventureModel';
import { CharacterModel } from '../models/characterModel';
import { AppText } from './AppText';
import { IconGen } from './IconGen';
const { width, height } = Dimensions.get('window')




export default function AdventureLists({ adventures, openAdventure }: any) {
    const scrollX = React.useRef(new Animated.Value(0)).current;
    return (
        <View style={{ height }}>
            <View
                style={[StyleSheet.absoluteFillObject]}>
                {adventures?.map((item: AdventureModel, index: number) => {
                    const inputRange = [
                        (index - 1) * width,
                        index * width,
                        (index + 1) * width
                    ];
                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0, 1, 0]
                    })
                    return <Animated.Image
                        blurRadius={.2}
                        style={[StyleSheet.absoluteFillObject, { opacity, resizeMode: "stretch", height: height - 70 }]}
                        key={index} source={{
                            uri: item.backgroundImage ?
                                `${Config.serverUrl}/uploads/adventure-backgrounds/${item.backgroundImage}` : `${Config.serverUrl}/assets/misc/adventureBackground.png`
                        }} />
                })}
            </View>
            <Animated.FlatList
                data={adventures}
                horizontal
                pagingEnabled
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }: any) => {
                    const inputRange = [
                        (index - 1) * width,
                        index * width,
                        (index + 1) * width
                    ];
                    const scale = scrollX.interpolate({
                        inputRange,
                        outputRange: [0, 1, 0]
                    })
                    return <View key={index} style={{ width, justifyContent: "center", alignItems: "center" }}>
                        <View style={{ position: "relative" }}>
                            <Animated.View style={{ justifyContent: "center", alignItems: "center", transform: [{ scale }] }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        openAdventure(item)
                                    }}
                                    style={{ alignItems: "center" }}>
                                    <View style={{
                                        backgroundColor: Colors.burgundy, padding: 15, justifyContent: "center",
                                        borderColor: Colors.whiteInDarkMode,
                                        borderWidth: 2, width: width * 0.7, alignItems: "center", borderRadius: 25
                                    }}>
                                        <AppText fontSize={25} textAlign={'center'} color={Colors.deepGold}> - Adventure - </AppText>
                                        <AppText fontSize={25} textAlign={'center'} color={Colors.deepGold}>{item.adventureName}</AppText>
                                    </View>
                                </TouchableOpacity>

                            </Animated.View>
                        </View>

                    </View>
                }}
            />
        </View>
    )
}