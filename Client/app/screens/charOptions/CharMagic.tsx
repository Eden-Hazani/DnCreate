import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { SpellCastingSwitch } from '../../../utility/spellCastingSwitch';
import { AppText } from '../../components/AppText';
import colors from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';

export class CharMagic extends Component<{ character: CharacterModel, currentProficiency: number }> {

    render() {
        const { spellcastingAbility, spellSaveDc, spellAttackModifier } = SpellCastingSwitch(this.props.character, this.props.currentProficiency)
        return (
            <View style={styles.container}>
                <View style={{ alignItems: "center", width: '100%' }}>
                    <AppText>Spell Casting Ability</AppText>
                    <View style={styles.triContainer}>
                        <AppText fontSize={15} >{spellcastingAbility}</AppText>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <View style={{ alignItems: "center", width: '50%' }}>
                        <AppText>Spell Save DC</AppText>
                        <View style={styles.triContainer}>
                            <AppText fontSize={25} >{spellSaveDc}</AppText>
                        </View>
                    </View>
                    <View style={{ alignItems: "center", width: '50%' }}>
                        <AppText>Spell Attack Modifier</AppText>
                        <View style={styles.triContainer}>
                            <AppText fontSize={25} >{spellAttackModifier}</AppText>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    triContainer: {
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: colors.bitterSweetRed,
        borderRadius: 70,
        height: 100,
        width: 100
    },
});