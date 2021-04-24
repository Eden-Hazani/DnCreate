import React, { useState } from 'react';
import { Alert, Animated, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../../config';
import { Colors } from '../../config/colors';
import useAuthContext from '../../hooks/useAuthContext';
import { CharacterModel } from '../../models/characterModel';
import { AppText } from '../AppText';
import { IconGen } from '../IconGen';
import { CharacterMarketInfo } from './CharacterMarketInfo';
const { width, height } = Dimensions.get('window')

const classesBackgrounds = {
    Barbarian: `${Config.serverUrl}/assets/classBackGrounds/BarbarianFinal.png`,
    Bard: `${Config.serverUrl}/assets/classBackGrounds/BardFinal.jpg`,
    Fighter: `${Config.serverUrl}/assets/classBackGrounds/FighterFinal.jpg`,
    Druid: `${Config.serverUrl}/assets/classBackGrounds/DruidFinal.png`,
    Cleric: `${Config.serverUrl}/assets/classBackGrounds/ClericFinal.jpg`,
    Monk: `${Config.serverUrl}/assets/classBackGrounds/MonkFinal.png`,
    Paladin: `${Config.serverUrl}/assets/classBackGrounds/PaladinFinal.jpg`,
    Ranger: `${Config.serverUrl}/assets/classBackGrounds/RangerFinal.png`,
    Rogue: `${Config.serverUrl}/assets/classBackGrounds/RogueFinal.png`,
    Sorcerer: `${Config.serverUrl}/assets/classBackGrounds/SorcererFinal.png`,
    Warlock: `${Config.serverUrl}/assets/classBackGrounds/WarlockFinal.png`,
    Wizard: `${Config.serverUrl}/assets/classBackGrounds/WizardFinal.jpg`,
    Artificer: `${Config.serverUrl}/assets/classBackGrounds/ArtificerFinal.png`,
}


export default function CharacterHallList({ characters, openCharacter, deleteChar }: any) {
    const userContext = useAuthContext()
    const scrollX = React.useRef(new Animated.Value(0)).current;
    return (
        <View style={{ height }}>
            <View
                style={[StyleSheet.absoluteFillObject]}>
                {characters?.map((item: CharacterModel, index: number) => {
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
                        blurRadius={1.6}
                        style={[StyleSheet.absoluteFillObject, { opacity, resizeMode: "stretch" }]}
                        key={index} source={{ uri: classesBackgrounds[item.characterClass || ''] }} />
                })}
            </View>
            <Animated.FlatList
                data={characters}
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
                            <Animated.View
                                style={{
                                    zIndex: 1,
                                    transform: [{ scale }],
                                    alignSelf: 'flex-end',
                                    position: 'absolute', left: -30, bottom: -65, elevation: 10, width: 70, height: 70
                                }}>
                                <TouchableOpacity
                                    onPress={() => { Alert.alert("Delete", "Are you sure you want to delete this character? (this action is irreversible)", [{ text: 'Yes', onPress: () => deleteChar(item) }, { text: 'No' }]) }}>
                                    <IconGen name={'trash-can-outline'} size={70}
                                        borderWidth={2}
                                        borderColor={Colors.whiteInDarkMode}
                                        iconColor={Colors.bitterSweetRed}
                                        backgroundColor={Colors.softPageBackground} />
                                </TouchableOpacity>
                            </Animated.View>
                            <Animated.View style={{ justifyContent: "center", alignItems: "center", transform: [{ scale }] }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        openCharacter(item, index)
                                    }}
                                    style={{ alignItems: "center" }}>
                                    <Image uri={`${Config.serverUrl}/assets/races/${item.image}`}
                                        style={{ width: 150, height: 150 }} />
                                    <View style={{
                                        backgroundColor: Colors.softPageBackground, padding: 15, justifyContent: "center",
                                        borderColor: Colors.whiteInDarkMode,
                                        borderWidth: 2, width: width * 0.7, alignItems: "center", borderRadius: 25
                                    }}>
                                        <AppText textAlign={'center'} fontSize={25} color={Colors.bitterSweetRed}>{item.name}</AppText>
                                        <AppText textAlign={'center'} fontSize={22} color={Colors.bitterSweetRed}>{item.race}</AppText>
                                        <AppText textAlign={'center'} fontSize={22} color={Colors.bitterSweetRed}>{item.characterClass}</AppText>
                                        <AppText textAlign={'center'} fontSize={22} color={Colors.bitterSweetRed}>Level {item.level}</AppText>
                                    </View>
                                </TouchableOpacity>

                            </Animated.View>
                            <Animated.View
                                style={{
                                    flex: 1,
                                    zIndex: 1,
                                    transform: [{ scale }],
                                    alignSelf: 'flex-end',
                                    position: 'absolute', right: -30, bottom: -65, width: 70, height: 70
                                }}>
                                {userContext.user?._id !== 'Offline' &&
                                    <CharacterMarketInfo index={index} character={item} />
                                }
                            </Animated.View>
                        </View>
                    </View>
                }}
            />
        </View>
    )
}