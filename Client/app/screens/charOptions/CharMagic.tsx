import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { SpellCastingSwitch } from '../../../utility/spellCastingSwitch';
import { AppText } from '../../components/AppText';
import colors from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { CharMagicLists } from './CharMagicLists';

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
                <View>
                    <AppText textAlign={'center'} fontSize={30}>Spells:</AppText>
                    {Object.values(this.props.character.spells).map((spellGroup, index) => <CharMagicLists character={this.props.character} key={index} level={spellGroup} spells={spellGroup} />)}
                </View>
                <AppText textAlign={'center'} fontSize={20}>Available Spell Slots</AppText>
                <View style={{ justifyContent: "space-evenly", flexDirection: 'row', flexWrap: "wrap" }}>
                    <View style={styles.spellSlot}>
                        <AppText textAlign={'center'} color={colors.totalWhite}>cantrips</AppText>
                        <AppText textAlign={'center'} color={colors.totalWhite} fontSize={20}>{this.props.character.magic.cantrips}</AppText>
                    </View>
                    <View style={styles.spellSlot}>
                        <AppText textAlign={'center'} color={colors.totalWhite}>1st Level</AppText>
                        <AppText textAlign={'center'} color={colors.totalWhite} fontSize={20}>{this.props.character.magic.firstLevelSpells}</AppText>
                    </View>
                    <View style={styles.spellSlot}>
                        <AppText textAlign={'center'} color={colors.totalWhite}>2nd Level</AppText>
                        <AppText textAlign={'center'} color={colors.totalWhite} fontSize={20}>{this.props.character.magic.secondLevelSpells}</AppText>
                    </View>
                    <View style={styles.spellSlot}>
                        <AppText textAlign={'center'} color={colors.totalWhite}>3rd Level</AppText>
                        <AppText textAlign={'center'} color={colors.totalWhite} fontSize={20}>{this.props.character.magic.thirdLevelSpells}</AppText>
                    </View>
                    <View style={styles.spellSlot}>
                        <AppText textAlign={'center'} color={colors.totalWhite}>4th Level</AppText>
                        <AppText textAlign={'center'} color={colors.totalWhite} fontSize={20}>{this.props.character.magic.forthLevelSpells}</AppText>
                    </View>
                    <View style={styles.spellSlot}>
                        <AppText textAlign={'center'} color={colors.totalWhite}>5th Level</AppText>
                        <AppText textAlign={'center'} color={colors.totalWhite} fontSize={20}>{this.props.character.magic.fifthLevelSpells}</AppText>
                    </View>
                    <View style={styles.spellSlot}>
                        <AppText textAlign={'center'} color={colors.totalWhite}>6th Level</AppText>
                        <AppText textAlign={'center'} color={colors.totalWhite} fontSize={20}>{this.props.character.magic.sixthLevelSpells}</AppText>
                    </View>
                    <View style={styles.spellSlot}>
                        <AppText textAlign={'center'} color={colors.totalWhite}>7th Level</AppText>
                        <AppText textAlign={'center'} color={colors.totalWhite} fontSize={20}>{this.props.character.magic.seventhLevelSpells}</AppText>
                    </View>
                    <View style={styles.spellSlot}>
                        <AppText textAlign={'center'} color={colors.totalWhite}>8th Level</AppText>
                        <AppText textAlign={'center'} color={colors.totalWhite} fontSize={20}>{this.props.character.magic.eighthLevelSpells}</AppText>
                    </View>
                    <View style={styles.spellSlot}>
                        <AppText textAlign={'center'} color={colors.totalWhite}>9th Level</AppText>
                        <AppText textAlign={'center'} color={colors.totalWhite} fontSize={20}>{this.props.character.magic.ninthLevelSpells}</AppText>
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
    spellSlot: {
        alignItems: "center",
        justifyContent: "center",
        margin: 5,
        backgroundColor: colors.bitterSweetRed,
        width: 100,
        height: 70,
        borderRadius: 25
    }
});