import React, { Component, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';
import { CharacterModel } from '../../../models/characterModel';

interface Props {
    character: CharacterModel;
    kiPoints: number;
    monkMartialArts: number;
    updateCharacter: Function;

}

export function LevelUpMonkArts({ character, kiPoints, monkMartialArts, updateCharacter }: Props) {

    useEffect(() => {
        addInfoToCharacter()
    }, [])

    const addInfoToCharacter = () => {
        const updatedCharacter = { ...character };
        if (character.charSpecials) {
            character.charSpecials.martialPoints = monkMartialArts;
            character.charSpecials.kiPoints = kiPoints;
        }
        updateCharacter(updatedCharacter)
    }

    return (
        <View style={styles.container}>
            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                <AppText color={Colors.bitterSweetRed} fontSize={22}> level {character.level} {character.characterClass}</AppText>
                <AppText textAlign={'center'}>You now possess {kiPoints} Ki points.</AppText>
                <AppText textAlign={'center'}>Your martial arts hit die is now {monkMartialArts}</AppText>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

    }
});