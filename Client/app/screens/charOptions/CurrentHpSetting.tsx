import React, { Component, FC, useEffect, useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../../config';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { AppTextInput } from '../../components/forms/AppTextInput';
import { IconGen } from '../../components/IconGen';
import NumberScroll from '../../components/NumberScroll';
import { Colors } from '../../config/colors';

interface Props {
    currentHp: string;
    openModal: boolean
    closeModal: Function
}

const { width, height } = Dimensions.get('window')

export function CurrentHpSetting({ currentHp, openModal, closeModal }: Props) {
    const [inputState, setInputState] = useState<string>('');
    const [damageAnimatedVal, setDamageAnimatedVal] = useState<Animated.ValueXY>(new Animated.ValueXY({ x: -width / 3, y: 0 }));
    const [healAnimatedVal, setHealAnimatedVal] = useState<Animated.ValueXY>(new Animated.ValueXY({ x: width / 3, y: 0 }));
    const [damageScale, setDamageScale] = useState<Animated.Value>(new Animated.Value(0));
    const [healScale, setHealScale] = useState<Animated.Value>(new Animated.Value(0));
    const [currentHealthChange, setCurrentHealthChange] = useState<number>(0)


    useEffect(() => {
        fireAnimation()
    }, [inputState])

    const fireAnimation = () => {
        if (inputState === 'damage') {
            Animated.parallel([
                Animated.timing(damageScale, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false
                }),
                Animated.timing(healScale, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false
                }),
                Animated.timing(damageAnimatedVal, {
                    toValue: { x: 0, y: 0 },
                    duration: 500,
                    useNativeDriver: false
                }),
                Animated.timing(healAnimatedVal, {
                    toValue: { x: width / 3, y: 0 },
                    duration: 500,
                    useNativeDriver: false
                })
            ]).start(() => {
                // callback
            });
        } else {
            Animated.parallel([
                Animated.timing(healScale, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false
                }),
                Animated.timing(damageScale, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false
                }),
                Animated.timing(damageAnimatedVal, {
                    toValue: { x: -width / 3, y: 0 },
                    duration: 500,
                    useNativeDriver: false
                }),
                Animated.timing(healAnimatedVal, {
                    toValue: { x: 0, y: 0 },
                    duration: 500,
                    useNativeDriver: false
                })
            ]).start(() => {
                // callback
            });
        }
    }

    return (
        <Modal visible={openModal}>
            <View style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
                <View style={{ flex: .1 }}>
                    <AppText fontSize={25} padding={10} textAlign={'center'}>Current HP: {currentHp}</AppText>
                    <View style={{ padding: 5 }}>
                        <AppText textAlign={'center'} fontSize={17}>Pick if you were damaged are healed.</AppText>
                        <AppText textAlign={'center'} fontSize={17} >Then scroll for the required result.</AppText>
                    </View>
                    <View style={styles.InfoContainer}>
                        <TouchableOpacity style={[styles.Button, { backgroundColor: Colors.danger, borderColor: Colors.whiteInDarkMode }]} onPress={() => setInputState('damage')}>
                            <AppText>Damaged for</AppText>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.Button, { backgroundColor: Colors.yellow, borderColor: Colors.whiteInDarkMode }]} onPress={() => setInputState('heal')}>
                            <AppText>Healed for</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.InnerContainer, { flex: .7 }]}>
                    <Animated.View style={[{
                        transform: [{ scale: damageScale }], width: damageScale.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, width],
                        })
                    }, damageAnimatedVal.getLayout(), styles.AnimatedView]}>
                        <AppText fontSize={22} color={Colors.danger}>DAMAGE</AppText>
                        <Image uri={`${Config.serverUrl}/assets/specificDragons/woundedDragon.png`} style={{ width: 150, height: 150 }} />
                        <View style={{ height: 100, flexDirection: 'row' }}>
                            <IconGen name={'chevron-left'} size={100} iconColor={Colors.whiteInDarkMode} />
                            <NumberScroll modelColor={Colors.pageBackground} max={450} getValue={(damage: any) => setCurrentHealthChange(damage)} />
                            <IconGen name={'chevron-right'} size={100} iconColor={Colors.whiteInDarkMode} />
                        </View>
                    </Animated.View>

                    <Animated.View style={[{
                        transform: [{ scale: healScale }], width: healScale.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, width],
                        })
                    }, healAnimatedVal.getLayout(), styles.AnimatedView]}>
                        <AppText fontSize={22} color={Colors.deepGold}>HEAL</AppText>
                        <Image uri={`${Config.serverUrl}/assets/classDragons/clericDragon.png`} style={{ width: 150, height: 150 }} />
                        <View style={{ height: 100, flexDirection: 'row' }}>
                            <IconGen name={'chevron-left'} size={100} iconColor={Colors.whiteInDarkMode} />
                            <NumberScroll modelColor={Colors.pageBackground} max={450} getValue={(heal: any) => setCurrentHealthChange(heal)} />
                            <IconGen name={'chevron-right'} size={100} iconColor={Colors.whiteInDarkMode} />
                        </View>
                    </Animated.View>

                </View>
                <View style={{ width: '100%', flex: .1, flexDirection: "row", justifyContent: "space-evenly" }}>
                    <AppButton backgroundColor={Colors.bitterSweetRed} width={100}
                        height={50} borderRadius={25} title={'Ok'} onPress={() => {
                            if (!currentHealthChange) return;
                            closeModal(inputState === "damage" ? -currentHealthChange : currentHealthChange)
                        }} />
                    <AppButton backgroundColor={Colors.bitterSweetRed} width={100}
                        height={50} borderRadius={25} title={'Cancel'} onPress={() => {
                            closeModal(0)
                        }} />
                </View>

            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center", alignItems: "center"
    },
    AnimatedView: {
        alignItems: "center",
        justifyContent: "center"
    },
    InfoContainer: {
        flexDirection: 'row',
        justifyContent: "space-evenly",
        width: '100%'
    },
    Button: {
        borderRadius: 25,
        padding: 15,
        borderWidth: 1
    },
    InnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        width: '100%'
    }
});