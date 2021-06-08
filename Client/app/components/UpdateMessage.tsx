import React, { Component, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, FlatList, Image, Animated } from 'react-native';
import { Config } from '../../config';
import { Colors } from '../config/colors';
import { AppButton } from './AppButton';
import { AppText } from './AppText';
import * as Linking from 'expo-linking';
import { AppActivityIndicator } from './AppActivityIndicator';
import { IconGen } from './IconGen';

const { height, width } = Dimensions.get('screen')
interface Props {
    close: Function
}

const serverData = [
    {
        title: 'Welcome To DnCreate',
        subTitle: "Let's take a tour of what DnCreate 2.07 has in store for everyone!",
        image: `${Config.serverUrl}/assets/welcomeTourImgs/currentPatch.png`,
        avatar: `${Config.serverUrl}/assets/welcomeTourImgs/avatars/levelUp.png`
    },
    {
        title: 'Your Character Sheet',
        subTitle: 'A full character sheet that updates as you level up. colorful and vibrant with exactly the information you need to play your character.',
        image: `${Config.serverUrl}/assets/welcomeTourImgs/mainCharacterPage.jpg`,
        avatar: `${Config.serverUrl}/assets/welcomeTourImgs/avatars/sheet.png`
    },
    {
        title: 'Become your class',
        subTitle: 'DnCreate has all the information you need to choose and advance in your class and subclass,',
        image: `${Config.serverUrl}/assets/welcomeTourImgs/classPicker.jpg`,
        avatar: `${Config.serverUrl}/assets/welcomeTourImgs/avatars/class.png`
    },
    {
        title: 'Adventures',
        subTitle: "Party up with your friends, create an adventure and start sharing information with each other in-app, (No more will the DM have to call you at 1AM and ask for your strength stat)",
        image: `${Config.serverUrl}/assets/welcomeTourImgs/adventureScreen.jpg`,
        avatar: `${Config.serverUrl}/assets/welcomeTourImgs/avatars/map.png`
    },
    {
        title: 'Adventure photo sharing',
        subTitle: "Use the photo gallery in adventure mode to share images with your party members, you can share locations, NPC's! or just memes",
        image: `${Config.serverUrl}/assets/welcomeTourImgs/adventureGalleryPhotos.jpg`,
        avatar: `${Config.serverUrl}/assets/welcomeTourImgs/avatars/picture.png`
    },
    {
        title: 'Issue and track party quests',
        subTitle: 'As the adventure DM you have the ability to issue quests to your party members, this system is helpful for tracking quest information.',
        image: `${Config.serverUrl}/assets/welcomeTourImgs/quests.jpg`,
        avatar: `${Config.serverUrl}/assets/welcomeTourImgs/avatars/quest.png`
    },
    {
        title: 'Fully animated dice roller',
        subTitle: 'DnCreate does all the calculations for you! just hit the attack button and let the dice roll! (All of your bonuses are included in the rolls)',
        image: `${Config.serverUrl}/assets/welcomeTourImgs/dice20roll.jpg`,
        avatar: `${Config.serverUrl}/assets/welcomeTourImgs/avatars/dice.png`
    },
    {
        title: 'Race and Subclass creators',
        subTitle: 'DnCreate has all the tools you need in app to create and share any race or subclass you want! with a friendly UI to help you create to your hearts content',
        image: `${Config.serverUrl}/assets/welcomeTourImgs/createRace.jpg`,
        avatar: `${Config.serverUrl}/assets/welcomeTourImgs/avatars/creation.png`
    },
    {
        title: 'The MarketPlace!',
        subTitle: 'Share your creations with the DnCreate community! you can submit any character you create to the marketplace for any user to download and use',
        image: `${Config.serverUrl}/assets/welcomeTourImgs/marketPlace.jpg`,
        avatar: `${Config.serverUrl}/assets/welcomeTourImgs/avatars/market.png`
    },
    {
        title: 'Patreon and Multiclassing',
        subTitle: 'DnCreate is very hard work and there is only one me :) \n\n Any donation towards DnCreate and a Multiclass system is greatly appreciated!',
        image: `${Config.serverUrl}/assets/welcomeTourImgs/patreonMultiClass.png`,
        avatar: `${Config.serverUrl}/assets/welcomeTourImgs/avatars/patreon.png`
    },
    {}

]


export function UpdateMessage({ close }: Props) {
    const [data, setData] = useState<any[]>([])
    const scrollX = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        loadImgFromServer()
    }, [])

    const loadImgFromServer = async () => {
        const returnedData = serverData.map(async (item) => item.image && Image.prefetch(item.image).finally(() => { return item }))
        await Promise.all(returnedData)
        setData(serverData)
    }

    return (
        <View style={{ backgroundColor: Colors.totalWhite }}>
            {data.length === 0 ? <View>
                <AppActivityIndicator visible={data.length === 0} />
                <AppText color={Colors.bitterSweetRed} fontSize={25} textAlign={'center'}>Loading Assets...</AppText>
            </View> :
                <>
                    <Animated.FlatList
                        data={data}
                        keyExtractor={(_, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled={true}
                        onScroll={Animated.event([
                            { nativeEvent: { contentOffset: { x: scrollX } } }
                        ], { useNativeDriver: true })}
                        renderItem={({ item, index }) => {
                            const inputRange = [
                                (index - 1) * width,
                                index * width,
                                (index + 1) * width
                            ];
                            const translateXImg = scrollX.interpolate({
                                inputRange,
                                outputRange: [-width * .7, 0, width * .7]
                            })
                            const translateXText = scrollX.interpolate({
                                inputRange,
                                outputRange: [width * 5, 0, -width * 1.5]
                            })
                            const scale = scrollX.interpolate({
                                inputRange,
                                outputRange: [3, 1, 4]
                            })
                            const opacity = scrollX.interpolate({
                                inputRange,
                                outputRange: [0, 1, 0]
                            })
                            if (index === data.length - 1) {
                                return <ScrollView style={{ width, height, flex: 1 }}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', height }}>
                                        <Animated.View style={{ transform: [{ translateX: translateXText }] }}>
                                            <AppText textAlign={'center'} fontSize={20} color={Colors.black}>I would like to thank our newest Patreon.</AppText>
                                            <AppText textAlign={'center'} fontSize={30} color={Colors.deepGold}>Ryan Thayer</AppText>
                                            <View style={{ paddingTop: 25 }}>
                                                <AppText textAlign={'center'} color={Colors.black} fontSize={25}>And I would like to thank all of you for using DnCreate</AppText>
                                                <AppText textAlign={'center'} color={Colors.black} fontSize={25}>Creating, sharing, and having fun with fantasy :D</AppText>
                                            </View>
                                            <View style={{ paddingTop: 25 }}>
                                                <AppText textAlign={'center'} color={Colors.black} fontSize={20}>Enough with the boardom, let's start using DnCreate!</AppText>
                                            </View>
                                        </Animated.View>
                                        <Animated.View style={{ opacity, transform: [{ scale }], paddingTop: 25 }}>
                                            <TouchableOpacity onPress={() => close(false)} style={{ backgroundColor: Colors.bitterSweetRed, padding: 15, borderRadius: 15 }}>
                                                <AppText color={Colors.totalWhite} fontSize={40}>Let's Go!</AppText>
                                            </TouchableOpacity>
                                        </Animated.View>
                                    </View>
                                </ScrollView>
                            }
                            return <View style={{ width, justifyContent: 'flex-start', alignItems: 'center', height, paddingTop: '5%' }}>
                                <View style={{
                                    backgroundColor: Colors.totalWhite,
                                    borderRadius: 15,
                                    padding: 12,
                                    shadowColor: Colors.black,
                                    elevation: 20,
                                    shadowOpacity: 1,
                                    shadowRadius: 20,
                                    shadowOffset: {
                                        width: 0,
                                        height: 0
                                    }
                                }}>
                                    <View style={styles.mainImg}>
                                        <Animated.Image source={{ uri: item.image }} style={{
                                            width: width,
                                            height: height,
                                            resizeMode: 'cover',
                                            transform: [{ translateX: translateXImg }]
                                        }}
                                        />
                                    </View>
                                    <Animated.View style={[styles.avatarImg, {
                                        borderColor: Colors.totalWhite,
                                        opacity,
                                        transform: [{ scale }],
                                        backgroundColor: Colors.totalWhite
                                    }]}>
                                        <Image source={{ uri: item.avatar }} style={{ top: 5, left: 5, width: 65, height: 65 }} />
                                    </Animated.View>
                                </View>
                                <Animated.View style={{ padding: 15, paddingTop: '8%', transform: [{ translateX: translateXText }] }}>
                                    <AppText fontSize={25} textAlign={'center'} color={Colors.bitterSweetRed}>{item.title}</AppText>
                                    <AppText color={Colors.black} fontSize={20} textAlign={'center'}>{item.subTitle}</AppText>
                                </Animated.View>
                                <View style={{ position: 'absolute', bottom: 10, left: 0, right: 0, justifyContent: 'center', alignItems: 'center' }}>
                                    <IconGen size={70} name={'chevron-right'} iconColor={Colors.bitterSweetRed} />
                                </View>
                            </View>
                        }}
                    />
                </>
            }
        </View>
    )
}


const styles = StyleSheet.create({
    avatarImg: {
        width: 80,
        height: 80,
        overflow: 'hidden',
        borderRadius: 80,
        position: 'absolute',
        bottom: -30,
        borderWidth: 3
    },
    mainImg: {
        width: width / 1.25,
        height: height / 1.6,
        overflow: 'hidden',
        alignItems: 'center',
        borderRadius: 15

    }
});