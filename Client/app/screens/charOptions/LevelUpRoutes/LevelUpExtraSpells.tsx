import React, { Component, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';
import { CharacterModel } from '../../../models/characterModel';
import spellsJSON from '../../../../jsonDump/spells.json'
import { spellLevelChanger } from '../helperFunctions/SpellLevelChanger';

interface Props {
    character: CharacterModel;
    extraSpells: any;
    notCountAgainstKnown: boolean;
    updateCharacter: Function;
}

export function LevelUpExtraSpells({ character, extraSpells, notCountAgainstKnown, updateCharacter }: Props) {

    useEffect(() => {
        const updatedCharacter = { ...character };
        for (let item of extraSpells) {
            const spell = spellsJSON.find(spell => spell.name === item)
            if (spell && updatedCharacter.spells) {
                const spellLevel = spellLevelChanger(spell.level)
                updatedCharacter.spells[spellLevel].push({ spell: spell, removable: false });
            }
        }
        if (notCountAgainstKnown) {
            updatedCharacter.spellsKnown = parseInt(updatedCharacter.spellsKnown + extraSpells.length).toString()
        }
        updateCharacter(updatedCharacter)
    }, [])

    return (
        <View>
            <View style={{ justifyContent: "center", alignItems: "center", padding: 10, marginTop: 15 }}>
                <AppText textAlign={'center'} fontSize={22}>As a level {character.level} {character.characterClass} of the {character.path.name} {character.charSpecials && character.charSpecials.druidCircle !== "false" ? `with the ${character.charSpecials.druidCircle} attribute` : null}</AppText>
                <AppText color={Colors.bitterSweetRed} fontSize={22}>You gain the following spells</AppText>
            </View>
            {extraSpells.map((spell: any, index: number) =>
                <View style={{ justifyContent: "center", alignItems: "center" }} key={`${spell.name}${index}`}>
                    <AppText fontSize={18}>{spell}</AppText>
                </View>)}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

    }
});