import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { list } from '../../../jsonDump/modifierNamingList.json'
import logger from '../../../utility/logger';

interface Props {
    saveThrowDiceRoll: Function
    character: CharacterModel
    currentProficiency: number
}

export function SheetSavingThrows({ saveThrowDiceRoll, character, currentProficiency }: Props) {

    const setSavingThrows = () => {
        try {
            const modifierList = list.map((modifierName, index) => {
                let midRes = '';
                if (character.savingThrows) {
                    if (character.savingThrows.includes(modifierName) && character.modifiers) {
                        midRes = `${modifierName} ${parseInt(character.modifiers[modifierName.toLowerCase()]) + currentProficiency > 0 ? '+' : ""} ${parseInt(character.modifiers[modifierName.toLowerCase()]) + currentProficiency}`
                    }
                    if ((!character.savingThrows.includes(modifierName)) && character.modifiers) {
                        midRes = `${modifierName} ${parseInt(character.modifiers[modifierName.toLowerCase()]) > 0 ? '+' : ""} ${parseInt(character.modifiers[modifierName.toLowerCase()])}`
                    }
                }
                return <TouchableOpacity onPress={() => {
                    let number = midRes.match(/\d/g);
                    if (number) {
                        saveThrowDiceRoll(parseInt(number.join("")))
                    }
                }}
                    key={index} style={{
                        borderColor: Colors.bitterSweetRed, borderWidth: 1,
                        borderRadius: 15, padding: 5, margin: 5, width: 150
                    }} >
                    <AppText textAlign={'center'} fontSize={18}>{midRes}</AppText>
                </TouchableOpacity>
            })
            return modifierList
        } catch (err) {
            logger.log
            return []
        }
    }

    return (
        <View>
            <AppText fontSize={20} textAlign={'center'}>Saving Throws</AppText>
            <View style={{ borderWidth: 1, borderRadius: 15, borderColor: Colors.bitterSweetRed, margin: 20, padding: 15 }}>
                <AppText fontSize={18} padding={5} textAlign={'center'}>Proficient Saving Throws</AppText>
                <View style={{ flexDirection: 'row', justifyContent: "space-evenly", alignItems: 'center', flexWrap: 'wrap' }}>
                    {character.savingThrows && character.savingThrows.map((sThrow, index) => <View key={index} style={{ padding: 5 }}>
                        <AppText>{sThrow}</AppText>
                    </View>)}
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: "space-evenly", alignItems: 'center', flexWrap: 'wrap' }}>
                {setSavingThrows()}
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

    }
});