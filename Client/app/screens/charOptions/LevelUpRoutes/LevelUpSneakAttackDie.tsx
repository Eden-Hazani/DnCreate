import React, { Component, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { AppText } from '../../../components/AppText';
import { CharacterModel } from '../../../models/characterModel';

interface Props {
    character: CharacterModel;
    updateCharacter: Function;
    sneakAttackDie: number;

}

export function LevelUpSneakAttackDie({ character, sneakAttackDie, updateCharacter }: Props) {

    useEffect(() => {
        insetInfoToChar()
    }, [])

    const insetInfoToChar = () => {
        const updatedCharacter = { ...character };
        if (updatedCharacter.charSpecials) {
            updatedCharacter.charSpecials.sneakAttackDie = sneakAttackDie;
        }
        updateCharacter(updatedCharacter)
    }
    return (
        <View style={styles.container}>
            <AppText textAlign={'center'} color={Colors.bitterSweetRed} fontSize={22}> level {character.level} {character.characterClass}</AppText>
            <AppText textAlign={'center'}>You can now roll {sneakAttackDie}D6 for a sneak attack.</AppText>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

    }
});