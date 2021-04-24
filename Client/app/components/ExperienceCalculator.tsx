import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Keyboard, Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';
import { Colors } from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { ActionType } from '../redux/action-type';
import { store } from '../redux/store';
import { experienceCalculator } from '../screens/charOptions/helperFunctions/experienceCalculator';
import { AppButton } from './AppButton';
import { AppText } from './AppText';
import { AppTextInput } from './forms/AppTextInput';
import * as xpChart from '../../jsonDump/experienceLevelChart.json'
import userCharApi from '../api/userCharApi';
import { IconGen } from './IconGen';
import useAnimateSection from '../hooks/useAnimatedSection';
const { width, height } = Dimensions.get('window')

interface Props {
    goalLevel: number
    currentExperience: number
    character: CharacterModel
    issueLevelUp: Function
}


export function ExperienceCalculator({ goalLevel, currentExperience, character, issueLevelUp }: Props) {

    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const [xpTextVal, setXpTestVal] = useState<string>('')
    const [animatedPosition, setAnimatedPosition] = useState<Animated.Value>(new Animated.Value(0))

    const launchAnimation = useAnimateSection(-500, 150)
    const moveAnimation = () => {
        Animated.timing(animatedPosition, {
            toValue: isVisible ? 1 : 0,
            duration: 100,
            useNativeDriver: false
        }).start()
    }

    useEffect(() => {
        moveAnimation()
    }, [isVisible])


    return (
        <Animated.View style={[launchAnimation.getLayout()]}>
            <View style={styles.container}>
                <View style={{ flexDirection: "row" }}>
                    <Animated.View style={{
                        width: animatedPosition.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, width / 1.5]
                        }),
                        height: animatedPosition.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, height / 8]
                        }),
                        transform: [{ scale: animatedPosition }]
                    }}>
                        <View style={{ flexDirection: 'row' }}>
                            <AppText>Current Experience </AppText>
                            <AppText> {currentExperience} / {xpChart[goalLevel]}</AppText>
                        </View>
                        <Progress.Bar color={Colors.bitterSweetRed} progress={experienceCalculator(currentExperience, goalLevel)} width={200} />
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ alignSelf: "baseline", top: 5 }}>
                                <AppButton backgroundColor={Colors.bitterSweetRed} height={30} width={70}
                                    fontSize={50} borderRadius={50} title={"Update XP"}
                                    onPress={() => {
                                        Keyboard.dismiss()
                                        const updatedCharacter = { ...character };
                                        if (updatedCharacter.currentExperience) {
                                            updatedCharacter.currentExperience = updatedCharacter.currentExperience + parseInt(xpTextVal)
                                        }
                                        if (!updatedCharacter.currentExperience) {
                                            updatedCharacter.currentExperience = 0 + parseInt(xpTextVal)
                                        }
                                        setXpTestVal('')

                                        if (experienceCalculator(updatedCharacter.currentExperience || 0, goalLevel) >= 1) {
                                            issueLevelUp(updatedCharacter.currentExperience)
                                            return
                                        }
                                        store.dispatch({ type: ActionType.SetInfoToChar, payload: updatedCharacter });
                                        userCharApi.updateChar(updatedCharacter)
                                    }} />
                            </View>
                            <View style={{ width: 150, right: 10 }}>
                                <AppTextInput
                                    defaultValue={xpTextVal.toString()}
                                    placeholder={'new XP'}
                                    keyboardType="numeric" onChangeText={(xpTextVal: string) => {
                                        const regex = new RegExp("^[0-9]+$")
                                        if (!regex.test(xpTextVal) && xpTextVal.length !== 0) {
                                            setIsError(true)
                                            return;
                                        }
                                        setXpTestVal(xpTextVal)
                                        setIsError(false)
                                    }} />
                            </View>
                            {isError && <View style={{ width: 150 }}>
                                <AppText color={Colors.danger}>Can only contain numbers!</AppText>
                            </View>}
                        </View>
                    </Animated.View>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: "baseline" }} onPress={() => {
                        if (isVisible) {
                            setIsVisible(false)
                            return
                        }
                        setIsVisible(true)
                    }}>
                        <AppText color={Colors.bitterSweetRed} fontSize={17}>XP</AppText>
                        <View style={{ top: 5 }}>
                            <IconGen name={isVisible ? 'chevron-left' : 'chevron-right'} size={70} iconColor={Colors.bitterSweetRed} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    )
}


const styles = StyleSheet.create({
    container: {

    }
});