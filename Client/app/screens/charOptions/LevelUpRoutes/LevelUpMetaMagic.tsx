import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { AppText } from '../../../components/AppText';
import { filterAlreadyPicked } from '../helperFunctions/filterAlreadyPicked';
import { CharacterModel } from '../../../models/characterModel'
import logger from '../../../../utility/logger';
import { Colors } from '../../../config/colors';
import { alterErrorSequence } from './functions/LevelUpUtilityFunctions';

interface Props {
    metaMagic: any;
    character: CharacterModel;
    totalMetaMagicPoints: number;
    updateCharacter: Function;
    updateErrorList: Function;
    beforeLevelUp: CharacterModel;
    errorList: { isError: boolean, errorDesc: string }[];
}


export function LevelUpMetaMagic({ metaMagic, character, totalMetaMagicPoints, updateCharacter, beforeLevelUp, updateErrorList, errorList }: Props) {

    const [isClicked, setIsClicked] = useState<any[]>([])

    const addInfoToCharacter = (item: any, addOrRemove: string) => {
        const updatedCharacter = { ...character };
        if (updatedCharacter.charSpecials) {
            if (addOrRemove === "ADD") {
                if (updatedCharacter.charSpecials && updatedCharacter.charSpecials.sorcererMetamagic) {
                    updatedCharacter.charSpecials.sorcererMetamagic.push(item)
                }
            }
            if (addOrRemove === "REMOVE") {
                if (updatedCharacter.charSpecials && updatedCharacter.charSpecials.sorcererMetamagic) {
                    const newMetaMagic = updatedCharacter.charSpecials.sorcererMetamagic.filter((magic) => magic.name !== item.name);
                    updatedCharacter.charSpecials.sorcererMetamagic = newMetaMagic;
                }
            }
        }
        updateCharacter(updatedCharacter)
    }

    const pickMetaMagic = (magic: any, index: number) => {
        try {
            const trueIsClicked = isClicked.filter((item) => item !== undefined);
            if (!isClicked[index]) {
                if (trueIsClicked.length >= totalMetaMagicPoints) {
                    alert(`You can only pick ${totalMetaMagicPoints} Metamagic abilities.`)
                    return;
                }
                const updatedClicked = [...isClicked];
                updatedClicked[index] = true;
                setIsClicked(updatedClicked);
                addInfoToCharacter(magic, "ADD")
            }
            else if (isClicked[index]) {
                const updatedClicked = [...isClicked];
                updatedClicked[index] = undefined;
                setIsClicked(updatedClicked);
                addInfoToCharacter(magic, "REMOVE")
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    useEffect(() => {
        const trueIsClicked = isClicked.filter((item) => item !== undefined);
        if (trueIsClicked.length !== totalMetaMagicPoints) {
            alterErrorSequence({ isError: true, errorDesc: 'You still have MetaMagic to pick' }, errorList, updateErrorList)
        } else {
            alterErrorSequence({ isError: false, errorDesc: 'You still have MetaMagic to pick' }, errorList, updateErrorList)
        }
    }, [isClicked])


    return (
        <View style={styles.container}>
            <AppText textAlign={'center'} color={Colors.bitterSweetRed} fontSize={22}> level {character.level} {character.characterClass}</AppText>
            <AppText textAlign={'center'}>You now gain the ability to twist your spells to suit your needs.</AppText>
            <AppText textAlign={'center'}>You gain two of the following Metamagic options of your choice. You gain another one at 10th and 17th level.</AppText>
            {filterAlreadyPicked(metaMagic.value, beforeLevelUp.charSpecials && beforeLevelUp.charSpecials.sorcererMetamagic ? beforeLevelUp.charSpecials.sorcererMetamagic : []).map((magic: any, index: number) =>
                <TouchableOpacity key={index} onPress={() => pickMetaMagic(magic, index)} style={[styles.longTextItem, { backgroundColor: isClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                    <AppText fontSize={20} color={isClicked[index] ? Colors.black : Colors.bitterSweetRed}>{magic.name}</AppText>
                    <AppText>{magic.description}</AppText>
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