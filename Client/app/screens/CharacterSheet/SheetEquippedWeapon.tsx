import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import rollForDamageCalc from '../charOptions/helperFunctions/rollForDamageCalc';

interface Props {
    character: CharacterModel
    isDm: boolean
    returnRoll: Function
    currentProficiency: number
}

export function SheetEquippedWeapon({ character, isDm, returnRoll, currentProficiency }: Props) {

    const rollDamageWithWeapon = () => {
        const { diceType, currentDiceRollValue, diceAmount, diceRolling } = rollForDamageCalc(character)
        returnRoll({ diceType, currentDiceRollValue, diceAmount, diceRolling })
    }

    const rollHitWithWeapon = () => {
        if (character.modifiers && character.currentWeapon?.isProficient && character.currentWeapon.modifier) {
            returnRoll({
                diceAmount: 1, diceType: 20, diceRolling: true,
                currentDiceRollValue: character.modifiers[character.currentWeapon.modifier.toLowerCase()] + currentProficiency
            })

        } else {
            returnRoll({
                diceAmount: 1, diceType: 20, diceRolling: true, currentDiceRollValue: currentProficiency
            })
        }
    }

    return (
        character.currentWeapon && character.currentWeapon.name ?
            <View style={{ borderColor: Colors.whiteInDarkMode, borderRadius: 15, borderWidth: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: "space-evenly" }}>
                    <TouchableOpacity style={{ backgroundColor: Colors.bitterSweetRed, width: '40%', borderRadius: 10, margin: 2 }}
                        disabled={isDm} onPress={() => rollDamageWithWeapon()}>
                        <AppText textAlign={'center'}>Roll{`\n`}Damage</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: Colors.bitterSweetRed, width: '40%', borderRadius: 10, margin: 2 }}
                        disabled={isDm} onPress={() => rollHitWithWeapon()}>
                        <AppText textAlign={'center'}>Roll{`\n`}Hit Chance</AppText>
                    </TouchableOpacity>
                </View>
                <AppText fontSize={25} textAlign={'center'}>Weapon Hit Dice</AppText>
                <AppText fontSize={15} textAlign={'center'}>Your currently equipped weapon does the following damage</AppText>
                <AppText fontSize={25} textAlign={'center'} color={Colors.bitterSweetRed}>{character.currentWeapon.diceAmount}-{character.currentWeapon.dice}</AppText>
            </View>
            : null
    )
}


const styles = StyleSheet.create({

});