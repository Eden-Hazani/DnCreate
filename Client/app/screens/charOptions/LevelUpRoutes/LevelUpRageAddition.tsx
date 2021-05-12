import React, { Component, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../components/AppText';
import { CharacterModel } from '../../../models/characterModel';

interface Props {
    rageAmount: number,
    rageDamage: number,
    character: CharacterModel,
    updateCharacter: Function
}

export function LevelUpRageAddition({ rageAmount, rageDamage, character, updateCharacter }: Props) {

    const updateRage = () => {
        const updatedCharacter = { ...character };
        if (updatedCharacter.charSpecials) {
            updatedCharacter.charSpecials.rageAmount = rageAmount;
            updatedCharacter.charSpecials.rageDamage = rageDamage;
            updateCharacter(updatedCharacter)
        }
    }

    useEffect(() => {
        updateRage()
    }, [])

    return (
        <View>
            <AppText textAlign={'center'} fontSize={18}>Your Rage amount is now - {rageAmount}</AppText>
            <AppText textAlign={'center'} fontSize={18}>Your Rage Damage bonus is now - {rageDamage}</AppText>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

    }
});