import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import logger from '../../../../utility/logger';
import { eldritchInvocations } from '../../../classFeatures/eldritchInvocations';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';
import { CharacterModel } from '../../../models/characterModel';
import { alterErrorSequence } from './functions/LevelUpUtilityFunctions';

interface Props {
    character: CharacterModel;
    totalInvocationPoints: number;
    updateCharacter: Function;
    updateErrorList: Function;
    beforeLevelUp: CharacterModel;
    errorList: { isError: boolean, errorDesc: string }[];
}

export function LevelUpInvocations({ character, errorList, beforeLevelUp, totalInvocationPoints, updateCharacter, updateErrorList }: Props) {
    const [isClicked, setIsClicked] = useState<any[]>([])
    const [currentEldritchInvocations, setCurrentEldritchInvocations] = useState(eldritchInvocations(character.level ? character.level : 0, character))

    const pickEldritchInvocations = (invocation: any, index: number) => {
        try {
            const trueIsClicked = isClicked.filter((item) => item !== undefined);
            if (!isClicked[index]) {
                if (trueIsClicked.length >= totalInvocationPoints) {
                    alert(`You can only pick ${totalInvocationPoints} Eldritch Invocations.`)
                    return;
                }
                const updatedClicked = [...isClicked];
                updatedClicked[index] = true;
                setIsClicked(updatedClicked);
                addInfoToCharacter(invocation, "ADD")
            }
            else if (isClicked[index]) {
                const updatedClicked = [...isClicked];
                updatedClicked[index] = undefined;
                setIsClicked(updatedClicked);
                addInfoToCharacter(invocation, "REMOVE")
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    const addInfoToCharacter = (item: any, addOrRemove: string) => {
        const updatedCharacter = { ...character };
        if (updatedCharacter.charSpecials) {
            if (addOrRemove === "ADD") {
                if (updatedCharacter.charSpecials && updatedCharacter.charSpecials.eldritchInvocations) {
                    updatedCharacter.charSpecials.eldritchInvocations.push(item)
                }
            }
            if (addOrRemove === "REMOVE") {
                if (updatedCharacter.charSpecials && updatedCharacter.charSpecials.eldritchInvocations) {
                    const newEldrichMagic = updatedCharacter.charSpecials.eldritchInvocations.filter((magic) => magic.name !== item.name);
                    updatedCharacter.charSpecials.eldritchInvocations = newEldrichMagic;
                }
            }
        }
        updateCharacter(updatedCharacter)
    }

    const findAlreadyChecked = () => {
        if (beforeLevelUp.charSpecials?.eldritchInvocations) {
            const availableInvocations = eldritchInvocations(beforeLevelUp.level ? beforeLevelUp.level : 0, beforeLevelUp)
            let index: number = 0;
            const updatedClicked = [...isClicked];
            for (let item of availableInvocations) {
                beforeLevelUp.charSpecials.eldritchInvocations.forEach((invocation) => {
                    if (invocation.name === item.name) {
                        updatedClicked[index] = true
                    }
                })
                index++
            }
            setIsClicked(updatedClicked)
        }
    }

    useEffect(() => {
        findAlreadyChecked()
    }, [])

    useEffect(() => {
        setCurrentEldritchInvocations(eldritchInvocations(character.level ? character.level : 0, character))
    }, [character])

    useEffect(() => {
        const trueIsClicked = isClicked.filter((item) => item !== undefined);
        if (trueIsClicked.length !== totalInvocationPoints) {
            alterErrorSequence({ isError: true, errorDesc: 'You still have Eldritch Invocations to pick' }, errorList, updateErrorList)
        } else {
            alterErrorSequence({ isError: false, errorDesc: 'You still have Eldritch Invocations to pick' }, errorList, updateErrorList)
        }
    }, [isClicked])



    return (
        <View style={styles.container}>
            <AppText textAlign={'center'} color={Colors.bitterSweetRed} fontSize={22}>As a level {character.level} {character.characterClass}</AppText>
            <AppText textAlign={'center'}>You now gain the ability to use Eldritch Invocations, these are powerful abilities you will unlock throughout leveling up</AppText>
            <AppText textAlign={'center'}>Remember that every time you level up you can choose to replace old invocations with new ones to suit your needs.</AppText>
            <AppText textAlign={'center'} fontSize={18}>You have a total of {totalInvocationPoints} Invocations.</AppText>
            {currentEldritchInvocations.map((invocation: any, index: number) =>
                <TouchableOpacity key={index} onPress={() => { pickEldritchInvocations(invocation, index) }} style={[styles.longTextItem, { backgroundColor: isClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                    <AppText fontSize={20} color={isClicked[index] ? Colors.black : Colors.bitterSweetRed}>{invocation.name}</AppText>
                    <AppText>{invocation.entries}</AppText>
                </TouchableOpacity>)}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

    },
    longTextItem: {
        marginTop: 15,
        width: Dimensions.get('screen').width / 1.2,
        marginLeft: 15,
        padding: 20,
        borderRadius: 15
    }
});