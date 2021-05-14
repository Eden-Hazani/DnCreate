import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Unsubscribe } from 'redux';
import errorHandler from '../../../utility/errorHander';
import charClassApi from '../../api/charClassApi';
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppError } from '../../components/AppError';
import { AppPicker } from '../../components/AppPicker';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { ClassModel } from '../../models/classModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, CacheManager } from 'react-native-expo-image-cache';
import { Config } from '../../../config';
import { IconGen } from '../../components/IconGen';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import InformationDrawer from '../../components/InformationDrawer';
import { classesDragonsBackgrounds } from '../../../utility/charClassesBackgrounds'
import logger from '../../../utility/logger';

const { width, height } = Dimensions.get('window');

const classesBackgrounds = {
    Starting: `${Config.serverUrl}/assets/classBackGrounds/Starting.png`,
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

const starterImg = [
    {
        name: "Starting",
        text: "In this section you will need to pick your characters class.",
        description: "Each class has it's own benefits and weaknesses, work with your team to create a versatile party!"
    }
]

interface ClassPickState {
    loading: boolean
    classes: ClassModel[] | undefined
    pickedClass: ClassModel
    characterInfo: CharacterModel
    error: boolean
    isUserOffline: boolean
    confirmed: boolean
}


export default function ClassPick({ route, placeholder }: any) {
    useEffect(() => {
        checkIfOffline()
        getClasses()
    }, [])
    const navigation = useNavigation();
    const [isUserOffline, setIsUserOffline] = useState(false);
    const [loading, setLoading] = useState(true);
    const [confirmed, setConfirmed] = useState(false);
    const [error, setError] = useState(false);
    const [classes, setClasses] = useState([]);
    const [pickedClass, setPickedClass] = useState(new ClassModel());
    const [characterInfo, setCharacterInfo] = useState(store.getState().character);
    const scrollX = React.useRef(new Animated.Value(0)).current;
    const checkIfOffline = async () => {
        const isOffline = await AsyncStorage.getItem('isOffline');
        if (isOffline) {
            setIsUserOffline(JSON.parse(isOffline))
        }
    }

    const insertInfoAndContinue = () => {
        characterInfo.characterClass = pickedClass.name;
        isUserOffline ? characterInfo.characterClassId = pickedClass : characterInfo.characterClassId = pickedClass._id as any;
        setConfirmed(true)
        setCharacterInfo(characterInfo)
        store.dispatch({ type: ActionType.SetInfoToChar, payload: characterInfo })
        setTimeout(() => {
            navigation.navigate("AttributePicking", { race: route.params.race })
        }, 800);
        setTimeout(() => {
            setConfirmed(false)
        }, 1100);
    }


    const getClasses = async () => {
        try {
            const result = await charClassApi.getClassesList();
            const classes: any = result.data;
            const wholeClasses: any = starterImg.concat(classes)
            setClasses(wholeClasses)
            setLoading(false)
        } catch (err) {
            setError(true)
            setLoading(false)
            logger.log(err)
        }
    }
    return (
        <View style={styles.container}>
            {confirmed ? <AppConfirmation visible={confirmed} /> :
                <View style={styles.container}>
                    {loading ? <AppActivityIndicator visible={loading} /> :
                        error ? <AppError /> :
                            <View style={{ height }}>
                                <View
                                    style={[StyleSheet.absoluteFillObject]}>
                                    {classes?.map((item: ClassModel, index) => {
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
                                            key={index} source={{ uri: classesBackgrounds[item.name || ''] }} />
                                    })}
                                </View>
                                <Animated.FlatList
                                    data={classes}
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
                                            {index === 0 ?
                                                <Animated.View style={{ justifyContent: "center", alignItems: "center", transform: [{ scale }] }}>
                                                    <Image uri={classesDragonsBackgrounds[item.name || '']}
                                                        style={{ width: 250, height: 250 }} />
                                                    <View style={{ width: width * 0.9 }}>
                                                        <View style={{ padding: 20, backgroundColor: Colors.burgundy, borderRadius: 25 }}>
                                                            <AppText textAlign={'center'} fontSize={20} color={Colors.deepGold}>{item.text}</AppText>
                                                            <AppText textAlign={'center'} fontSize={17} color={Colors.deepGold}>{item.description}</AppText>
                                                        </View>
                                                    </View>
                                                </Animated.View>
                                                :
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setPickedClass(item)
                                                    }}
                                                >
                                                    <Animated.View style={{ justifyContent: "center", alignItems: "center", transform: [{ scale }] }}>
                                                        <Image uri={classesDragonsBackgrounds[item.name || '']}
                                                            style={{ width: 250, height: 250 }} />
                                                        <AppText fontSize={30} color={Colors.deepGold}>{item.name}</AppText>
                                                        <IconGen iconColor={Colors.deepGold} name={item.icon} size={120} />
                                                    </Animated.View>
                                                </TouchableOpacity>
                                            }
                                        </View>
                                    }}
                                />
                                <Modal
                                    propagateSwipe={true}
                                    isVisible={pickedClass._id ? true : false}
                                    swipeDirection={"down"}
                                    swipeThreshold={5}
                                    onSwipeComplete={(e) => {
                                        setPickedClass(new ClassModel())
                                    }}
                                    style={{
                                        backgroundColor: Colors.pageBackground,
                                        margin: 0,
                                        flex: 1,
                                        marginTop: 140,
                                        alignItems: undefined,
                                        justifyContent: undefined,
                                    }}>
                                    <ScrollView style={{ flex: 1 }}>
                                        <View style={{ position: 'absolute', right: 0 }}>
                                            <IconGen name={'chevron-down'} size={70} />
                                            <AppText textAlign={'center'}>Pull down {'\n'}to cancel</AppText >
                                        </View>
                                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                                            <Image style={{ width: 150, height: 150 }} uri={classesDragonsBackgrounds[pickedClass.name || '']} />
                                        </View>
                                        <TouchableOpacity activeOpacity={1}>
                                            <AppText fontSize={30} textAlign={"center"} color={Colors.bitterSweetRed}>Class {pickedClass.name}</AppText>
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
                                                <View style={{ width: "50%", marginTop: 10 }}>
                                                    <AppText textAlign={"center"} fontSize={15} color={Colors.bitterSweetRed}>Recommended Attributes</AppText>
                                                    <AppText textAlign={"center"} fontSize={13}>{pickedClass.recommendation}</AppText>
                                                </View>
                                                <View style={{ width: "50%" }}>
                                                    <AppText textAlign={"center"} fontSize={15} color={Colors.bitterSweetRed}>Saving Throws</AppText>
                                                    {pickedClass.savingThrows && pickedClass.savingThrows.map((item) => <AppText key={item} textAlign={"center"} fontSize={13}>{item}</AppText>)}
                                                </View>
                                            </View>
                                            <View style={{ padding: 15, width: '100%', flex: 1 }}>
                                                <AppText fontSize={17} textAlign={"center"}>{pickedClass.description &&
                                                    pickedClass.description.replace(/\. /g, '.\n')}</AppText>
                                            </View>
                                            <View style={{ alignItems: "center", padding: 15 }}>
                                                <InformationDrawer expendedHeight={500} expendedWidth={width} information={pickedClass.brifInfo} />
                                            </View>
                                            <View>
                                                <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100}
                                                    height={100} title={"Continue"} onPress={() => {
                                                        insertInfoAndContinue()
                                                        setPickedClass(new ClassModel())
                                                    }} />
                                            </View>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </Modal>
                            </View>
                    }
                </View>}
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});