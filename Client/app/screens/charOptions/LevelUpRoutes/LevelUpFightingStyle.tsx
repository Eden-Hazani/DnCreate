import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import logger from '../../../../utility/logger';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';
import { CharacterModel } from '../../../models/characterModel';

interface Props {
    character: CharacterModel;
    fightingStyles: any[];
    updateCharacter: Function
}

export function LevelUpFightingStyle({ character, fightingStyles, updateCharacter }: Props) {

    const pickFightingStyle = (style: any, index: number) => {
        try {
            const updatedCharacter = { ...character };
            if (updatedCharacter.charSpecials?.fightingStyle) {
                updatedCharacter.charSpecials.fightingStyle[0] = style
            }
            console.log(updatedCharacter.charSpecials?.fightingStyle)
            updateCharacter(updatedCharacter)
        } catch (err) {
            logger.log(new Error(err))
        }
    }



    const highlightTextPicked = (style: { name: string, description: string }) => {
        if (character.charSpecials?.fightingStyle && character.charSpecials.fightingStyle.length > 0) {
            if (character.charSpecials.fightingStyle[0].name === style.name) return Colors.black
        }
        return Colors.bitterSweetRed
    }

    const highlightBackGroundPicked = (style: { name: string, description: string }) => {
        if (character.charSpecials?.fightingStyle && character.charSpecials.fightingStyle.length > 0) {
            if (character.charSpecials.fightingStyle[0].name === style.name) return Colors.bitterSweetRed
        }
        return Colors.lightGray
    }

    return (
        <View>
            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                <AppText color={Colors.bitterSweetRed} fontSize={22}>As a level {character.level} {character.characterClass}</AppText>
                <AppText textAlign={'center'}>You can pick your fighting style, this choice will bring you benefits on your preferred way of combat:</AppText>
            </View>
            {fightingStyles.map((style: any, index: number) =>
                <TouchableOpacity key={index} onPress={() => { pickFightingStyle(style, index) }} style={[styles.longTextItem, { backgroundColor: highlightBackGroundPicked(style) }]}>
                    <AppText fontSize={20} color={highlightTextPicked(style)}>{style.name}</AppText>
                    <AppText>{style.description}</AppText>
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