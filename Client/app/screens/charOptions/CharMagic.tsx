import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { SpellCastingSwitch } from '../../../utility/spellCastingSwitch';
import { AppText } from '../../components/AppText';
import colors from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { CharMagicLists } from './CharMagicLists';
import { checkAvailableKnownSpells } from './helperFunctions/cheakSpellSlots';
import * as SpellCastingJson from '../../../jsonDump/spellCastingScores.json'

export class CharMagic extends Component<{ character: CharacterModel, currentProficiency: number, reloadChar: any }> {

    render() {
        const { spellcastingAbility, spellSaveDc, spellAttackModifier } = SpellCastingSwitch(this.props.character, this.props.currentProficiency)
        return (
            <View style={styles.container}>
                {SpellCastingJson[this.props.character.path?.name]?.spellcastingAbility === "none" ?
                    <View>
                        {this.props.character.path.name === "Way of the Shadow" &&
                            <AppText textAlign={'center'} fontSize={18}>As a {this.props.character.path.name} {this.props.character.characterClass} your spell casting abilities relay on your Ki points.</AppText>
                        }
                    </View>
                    :
                    <View>
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
                }
                <View style={{ padding: 15 }}>
                    {checkAvailableKnownSpells(this.props.character) > 0 ?
                        <AppText textAlign={'center'} fontSize={18}>You still have {checkAvailableKnownSpells(this.props.character)} Known spells that you can pick from your spell book</AppText>
                        :
                        <AppText textAlign={'center'} fontSize={18}>You know the maximum amount of spells for your level</AppText>
                    }
                    {(this.props.character.characterClass === 'Wizard' || this.props.character.characterClass === 'Cleric'
                        || this.props.character.characterClass === 'Paladin' || this.props.character.characterClass === 'Druid') ?
                        <View>
                            <AppText textAlign={'center'} fontSize={18}>Remember that as a {this.props.character.characterClass} your known spells are the spells you have prepared for the day and can be replaced every long rest.</AppText>
                        </View>
                        :
                        <View>
                            <AppText textAlign={'center'} fontSize={18}>Remember that as a {this.props.character.characterClass} your known spells are the spells that your character has learned throughout its journey, you can only learn or replace spells once you level up.</AppText>
                        </View>
                    }
                    {this.props.character.characterClass === 'Wizard' &&
                        <View style={{ marginTop: 5, marginBottom: 5 }}>
                            <AppText color={colors.berries} textAlign={'center'} fontSize={18}>As a Wizard your known spells come from your personal spell book, you can add new spells to your spell book by buying them or learning them throughout your adventure.</AppText>
                        </View>
                    }
                    <View>
                    </View>
                </View>
                <View>
                    <AppText textAlign={'center'} fontSize={30}>Spells:</AppText>
                    {Object.values(this.props.character.spells).map((spellGroup, index) => <CharMagicLists reloadChar={() => this.props.reloadChar()} character={this.props.character} key={index} level={spellGroup} spells={spellGroup} />)}
                </View>
                {this.props.character.characterClass === "Warlock" ?
                    <View style={{ marginBottom: 20, padding: 15 }}>
                        <AppText fontSize={18} textAlign={'center'}>You currently have {this.props.character.charSpecials.warlockSpellSlots} spell slots that can be used up to {this.props.character.charSpecials.warlockSpellSlotLevel} spell level</AppText>
                        <AppText fontSize={18} textAlign={'center'}>Remember that as a warlock your spell slots are different from all other classes.</AppText>
                        <AppText fontSize={18} textAlign={'center'}>you are able to use any of your spell slots for any spell level (that you have access to.)</AppText>
                    </View>
                    :
                    <View>
                        <AppText textAlign={'center'} fontSize={20}>Available Spell Slots</AppText>
                        <View style={{ justifyContent: "space-evenly", flexDirection: 'row', flexWrap: "wrap" }}>
                            {this.props.character.magic.cantrips &&
                                <View style={styles.spellSlot}>
                                    <AppText textAlign={'center'} color={colors.totalWhite}>cantrips</AppText>
                                    <AppText textAlign={'center'} color={colors.totalWhite} fontSize={20}>{this.props.character.magic.cantrips}</AppText>
                                </View>
                            }
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
                }
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