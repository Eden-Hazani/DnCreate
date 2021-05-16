import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import logger from '../../../../utility/logger';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';
import { CharacterModel } from '../../../models/characterModel';
import { alterErrorSequence } from './functions/LevelUpUtilityFunctions';

interface Props {
    character: CharacterModel;
    updateCharacter: Function;
    pactSelector: any[];
    updateErrorList: Function;
    errorList: { isError: boolean, errorDesc: string }[];
}

export function LevelUpWarlockPact({ character, updateCharacter, updateErrorList, errorList, pactSelector }: Props) {
    const [isClicked, setIsClicked] = useState<any[]>([])

    const pickWarlockPact = (pact: any, index: number) => {
        try {
            if (!isClicked[index]) {
                if (character.charSpecials?.warlockPactBoon as any !== false || character.charSpecials?.warlockPactBoon) {
                    alert('You can only pick one pact.')
                    return;
                }
                const updatedClicked = [...isClicked];
                updatedClicked[index] = true;
                setIsClicked(updatedClicked);
                addInfoToCharacter(pact, "ADD")
            }
            else if (isClicked[index]) {
                const updatedClicked = [...isClicked];
                updatedClicked[index] = undefined;
                setIsClicked(updatedClicked);
                addInfoToCharacter(pact, "REMOVE")
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }


    const addInfoToCharacter = (item: any, addOrRemove: string) => {
        const updatedCharacter = { ...character };
        if (updatedCharacter.charSpecials) {
            if (addOrRemove === "ADD") {
                updatedCharacter.charSpecials.warlockPactBoon = item
            }
            if (addOrRemove === "REMOVE") {
                updatedCharacter.charSpecials.warlockPactBoon = false as any;
            }
        }
        updateCharacter(updatedCharacter)
    }

    useEffect(() => {
        if (character.charSpecials?.warlockPactBoon !== false as any) {
            alterErrorSequence({ isError: false, errorDesc: 'Must pick a pact' }, errorList, updateErrorList)
        } else {
            alterErrorSequence({ isError: true, errorDesc: 'Must pick a pact' }, errorList, updateErrorList)
        }
    }, [isClicked])


    return (
        <View style={{ padding: 15 }}>
            <AppText textAlign={'center'} color={Colors.bitterSweetRed} fontSize={22}>As a level {character.level} {character.characterClass}</AppText>
            <AppText fontSize={17} textAlign={'center'}>You can now pick one of three pacts, these pacts will unlock powerful Eldritch Invocations at later levels</AppText>
            <AppText fontSize={17} textAlign={'center'}>Remember, you can only choose one pact and you cannot change it.</AppText>
            <AppText fontSize={17} textAlign={'center'}>Once you pick a pact new Eldritch Invocations will be unlocked, scroll up and see if you find something you fancy!</AppText>
            {pactSelector.map((pact: any, index: number) =>
                <TouchableOpacity key={index} onPress={() => { pickWarlockPact(pact, index) }} style={[styles.longTextItem, { backgroundColor: isClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                    <AppText fontSize={20} color={isClicked[index] ? Colors.black : Colors.bitterSweetRed}>{pact.name}</AppText>
                    <AppText>{pact.description}</AppText>
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