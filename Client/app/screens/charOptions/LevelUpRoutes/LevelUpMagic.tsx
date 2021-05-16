import React, { Component, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import logger from '../../../../utility/logger';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';
import { CharacterModel } from '../../../models/characterModel';
import { levelUpMagic } from './functions/magicLevelUpFunctions';

interface Props {
    character: CharacterModel;
    spellSlotLevel: string;
    spellSlots: number;
    beforeLevelUp: CharacterModel;
    sorceryPoints: number;
    spellsKnown: number;
    cantrips: number;
    spells: number[];
    updateCharacter: Function
}

export function LevelUpMagic({ character, spellSlotLevel, spellSlots, beforeLevelUp, sorceryPoints, spellsKnown, cantrips, spells, updateCharacter }: Props) {

    const checkSpellSlotImprove = (spellSlot: string) => {
        try {
            if (!beforeLevelUp) {
                return;
            }
            if (character.magic && beforeLevelUp.magic) {
                const difference = character.magic[spellSlot] - beforeLevelUp.magic[spellSlot];
                return difference === 0 ? '' : ` + ${difference} new!`;
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    useEffect(() => {
        const updatedCharacter = levelUpMagic(character, spellSlotLevel, spellSlots, sorceryPoints, spellsKnown, cantrips, spells);
        updateCharacter(updatedCharacter)
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.magic}>
                <AppText textAlign={'center'} color={Colors.bitterSweetRed} fontSize={22}>As a level {character.level} {character.characterClass}</AppText>
                {character.characterClass === "Warlock" ?
                    <View>
                        <AppText fontSize={18} textAlign={'center'}>You posses the following magical abilities</AppText>
                        <AppText fontSize={18} textAlign={'center'}>You can now cast {character.magic && character.magic.cantrips} cantrips</AppText>
                        <AppText fontSize={18} textAlign={'center'}>You can now cast {spellSlots} spells at {spellSlotLevel} Level</AppText>
                    </View>
                    :
                    <View>
                        <AppText fontSize={20}>You gain the following spell slots:</AppText>
                        <AppText fontSize={18}>- Cantrips: {character.magic !== undefined && character.magic.cantrips} {checkSpellSlotImprove('cantrips')}</AppText>
                        <AppText fontSize={18}>- 1st level spells: {character.magic !== undefined && character.magic.firstLevelSpells} {checkSpellSlotImprove('firstLevelSpells')}</AppText>
                        <AppText fontSize={18}>- 2nd level spells: {character.magic !== undefined && character.magic.secondLevelSpells} {checkSpellSlotImprove('secondLevelSpells')}</AppText>
                        <AppText fontSize={18}>- 3rd level spells: {character.magic !== undefined && character.magic.thirdLevelSpells} {checkSpellSlotImprove('thirdLevelSpells')}</AppText>
                        <AppText fontSize={18}>- 4th level spells: {character.magic !== undefined && character.magic.forthLevelSpells} {checkSpellSlotImprove('forthLevelSpells')}</AppText>
                        <AppText fontSize={18}>- 5th level spells: {character.magic !== undefined && character.magic.fifthLevelSpells} {checkSpellSlotImprove('fifthLevelSpells')}</AppText>
                        <AppText fontSize={18}>- 6th level spells: {character.magic !== undefined && character.magic.sixthLevelSpells} {checkSpellSlotImprove('sixthLevelSpells')}</AppText>
                        <AppText fontSize={18}>- 7th level spells: {character.magic !== undefined && character.magic.seventhLevelSpells} {checkSpellSlotImprove('seventhLevelSpells')}</AppText>
                        <AppText fontSize={18}>- 8th level spells: {character.magic !== undefined && character.magic.eighthLevelSpells} {checkSpellSlotImprove('eighthLevelSpells')}</AppText>
                        <AppText fontSize={18}>- 9th level spells: {character.magic !== undefined && character.magic.ninthLevelSpells} {checkSpellSlotImprove('ninthLevelSpells')}</AppText>
                    </View>
                }
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

    },
    magic: {
        alignItems: "center"
    }
});