import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { SpellCastingSwitch } from '../../../utility/spellCastingSwitch';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { CharMagicLists } from './CharMagicLists';
import { checkAvailableKnownSpells } from './helperFunctions/cheakSpellSlots';
import * as SpellCastingJson from '../../../jsonDump/spellCastingScores.json'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { spellCharMagicRenaming } from './helperFunctions/spellCharMagicRenaming';
import { hpColors } from '../../../utility/hpColors';
import { AppButton } from '../../components/AppButton';
import logger from '../../../utility/logger';

interface CharMagicState {
    availableMagic: number[]
}

export class CharMagic extends Component<{ isDm: boolean, character: CharacterModel, currentProficiency: number, reloadChar: any }, CharMagicState> {
    constructor(props: any) {
        super(props)
        this.state = {
            availableMagic: []
        }
    }

    async componentDidMount() {
        try {
            let availableMagic = await AsyncStorage.getItem(`${this.props.character._id}availableMagic`);
            if (this.props.character.magic) {
                const totalMagic = Object.values(this.props.character.magic);
                if (availableMagic) {
                    let availableMagicArray = JSON.parse(availableMagic);
                    availableMagicArray = availableMagicArray.filter((item: number) => item !== 0);
                    this.setState({ availableMagic: availableMagicArray })
                }
                if (!availableMagic) {
                    const newAvailableMagic: number[] = [];
                    for (let item of totalMagic) {
                        newAvailableMagic.push(item)
                    }
                    this.setState({ availableMagic: newAvailableMagic })
                    await AsyncStorage.setItem(`${this.props.character._id}availableMagic`, JSON.stringify(newAvailableMagic));
                }
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    useSpellSlot = (index: number) => {
        try {
            const availableMagic = this.state.availableMagic;
            if (availableMagic[index] === 0) {
                return;
            }
            availableMagic[index] = availableMagic[index] - 1;
            this.setState({ availableMagic }, async () => {
                await AsyncStorage.setItem(`${this.props.character._id}availableMagic`, JSON.stringify(this.state.availableMagic));
            })
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    renewSpellSlot = (index: number) => {
        try {
            if (this.props.character.magic) {
                const totalMagic = Object.values(this.props.character.magic);
                const availableMagic = this.state.availableMagic;
                if (availableMagic[index] === totalMagic[index]) {
                    return;
                }
                availableMagic[index] = availableMagic[index] + 1;
                this.setState({ availableMagic }, async () => {
                    await AsyncStorage.setItem(`${this.props.character._id}availableMagic`, JSON.stringify(this.state.availableMagic));
                })
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    render() {
        let spellCantripList: any = []
        let magicCantripList: number = 0
        if (this.props.character.spells && this.props.character.spells.cantrips) {
            spellCantripList = this.props.character.spells.cantrips;
        }
        if (this.props.character.magic && this.props.character.magic.cantrips) {
            magicCantripList = this.props.character.magic.cantrips;
        }
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
                            <View style={[styles.triContainer, { borderColor: Colors.bitterSweetRed }]}>
                                <AppText fontSize={15} >{spellcastingAbility}</AppText>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <View style={{ alignItems: "center", width: '50%' }}>
                                <AppText>Spell Save DC</AppText>
                                <View style={[styles.triContainer, { borderColor: Colors.bitterSweetRed }]}>
                                    <AppText fontSize={25} >{spellSaveDc}</AppText>
                                </View>
                            </View>
                            <View style={{ alignItems: "center", width: '50%' }}>
                                <AppText>Spell Attack Modifier</AppText>
                                <View style={[styles.triContainer, { borderColor: Colors.bitterSweetRed }]}>
                                    <AppText fontSize={25} >{spellAttackModifier}</AppText>
                                </View>
                            </View>
                        </View>
                    </View>
                }
                <View style={{ padding: 15 }}>
                    <View style={{ padding: 15 }}>
                        {magicCantripList > spellCantripList.length ?
                            <AppText textAlign={'center'} fontSize={18}>You still have {magicCantripList - spellCantripList.length} Cantrips that you can pick from your spell book</AppText>
                            :
                            <AppText textAlign={'center'} fontSize={18}>You know the maximum amount of cantrips for your level</AppText>
                        }
                    </View>
                    <View style={{ padding: 15 }}>
                        {checkAvailableKnownSpells(this.props.character) > 0 ?
                            <AppText textAlign={'center'} fontSize={18}>You still have {checkAvailableKnownSpells(this.props.character)} Known spells that you can pick from your spell book</AppText>
                            :
                            <AppText textAlign={'center'} fontSize={18}>You know the maximum amount of spells for your level</AppText>
                        }
                    </View>
                    {(this.props.character.characterClass === 'Wizard' || this.props.character.characterClass === 'Cleric'
                        || this.props.character.characterClass === 'Paladin' || this.props.character.characterClass === 'Druid' || this.props.character.characterClass === 'Artificer') ?
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
                            <AppText color={Colors.berries} textAlign={'center'} fontSize={18}>As a Wizard your known spells come from your personal spell book, you can add new spells to your spell book by buying them or learning them throughout your adventure.</AppText>
                        </View>
                    }
                    <View>
                    </View>
                </View>
                <View>
                    <AppText textAlign={'center'} fontSize={30}>Spells:</AppText>
                    {Object.values(this.props.character.spells !== undefined && this.props.character.spells).map((spellGroup, index) => <CharMagicLists isDm={this.props.isDm} reloadChar={() => this.props.reloadChar()} character={this.props.character} key={index} level={spellGroup} spells={spellGroup} />)}
                </View>
                {this.props.isDm ?
                    <View>
                        {this.props.character.characterClass === "Warlock" ?
                            <View style={{ marginBottom: 20, padding: 15 }}>
                                <AppText fontSize={18} textAlign={'center'}>You currently have {this.props.character.charSpecials !== undefined && this.props.character.charSpecials.warlockSpellSlots} spell slots that can be used up to {this.props.character.charSpecials !== undefined && this.props.character.charSpecials.warlockSpellSlotLevel} spell level</AppText>
                                <AppText fontSize={18} textAlign={'center'}>Remember that as a warlock your spell slots are different from all other classes.</AppText>
                                <AppText fontSize={18} textAlign={'center'}>you are able to use any of your spell slots for any spell level (that you have access to.)</AppText>
                            </View>
                            :
                            <View>
                                <AppText textAlign={'center'} fontSize={20}>Total Spell Slots</AppText>
                                <View style={{ justifyContent: "space-evenly", flexDirection: 'row', flexWrap: "wrap" }}>
                                    {Object.entries(this.props.character.magic !== undefined && this.props.character.magic).map((item, index) =>
                                        <TouchableOpacity disabled={this.props.isDm} key={index} style={[styles.spellSlot,
                                        { backgroundColor: Colors.berries }]}
                                            onLongPress={() => {
                                                Vibration.vibrate(400)
                                                this.renewSpellSlot(index)
                                            }} onPress={() => {
                                                this.useSpellSlot(index)
                                            }}>
                                            <AppText padding={5} textAlign={'left'} fontSize={18} color={Colors.whiteInDarkMode}>{spellCharMagicRenaming(item[0])}</AppText>
                                            <AppText padding={5} textAlign={'left'} color={Colors.whiteInDarkMode} fontSize={15}>Total slots: {item[1]}</AppText>
                                        </TouchableOpacity>)}
                                </View>
                            </View>
                        }
                    </View>
                    :
                    <View>
                        {this.props.character.characterClass === "Warlock" ?
                            <View>
                                <View style={{ marginBottom: 5, padding: 15, paddingBottom: 5 }}>
                                    <AppText fontSize={18} textAlign={'center'}>You currently have a total of {this.props.character.magic && this.props.character.magic.cantrips} Available</AppText>
                                </View>
                                <View style={{ marginBottom: 20, padding: 15 }}>
                                    <AppText fontSize={18} textAlign={'center'}>You currently have {this.props.character.charSpecials && this.props.character.charSpecials.warlockSpellSlots} spell slots that can be used up to {this.props.character.charSpecials && this.props.character.charSpecials.warlockSpellSlotLevel} spell level</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>Remember that as a warlock your spell slots are different from all other classes.</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>you are able to use any of your spell slots for any spell level (that you have access to.)</AppText>
                                </View>
                            </View>
                            :
                            <View>
                                <AppText textAlign={'center'} fontSize={20}>Available Spell Slots</AppText>
                                <View>
                                    <AppText textAlign={'center'} color={Colors.berries} fontSize={18}>Tap a spell slot to use it.</AppText>
                                    <AppText textAlign={'center'} color={Colors.berries} fontSize={18}>Long tap a spell slot to restore it.</AppText>
                                    <AppText textAlign={'center'} color={Colors.berries} fontSize={18}>press reset to reset all your used spells</AppText>
                                    <AppButton fontSize={45} backgroundColor={Colors.bitterSweetRed}
                                        borderRadius={100} width={60} height={60} title={"reset"} onPress={async () => {
                                            const totalMagic = Object.values(this.props.character.magic !== undefined && this.props.character.magic);
                                            const newAvailableMagic = []
                                            for (let item of totalMagic) {
                                                newAvailableMagic.push(item)
                                            }
                                            this.setState({ availableMagic: newAvailableMagic })
                                            await AsyncStorage.setItem(`${this.props.character._id}availableMagic`, JSON.stringify(newAvailableMagic));
                                        }} />

                                </View>
                                <View style={{ justifyContent: "space-evenly", flexDirection: 'row', flexWrap: "wrap" }}>
                                    {Object.entries(this.props.character.magic !== undefined && this.props.character.magic).map((item, index) =>
                                        <View key={index}>
                                            {item[0] === "cantrips" ?
                                                <View style={[styles.spellSlot, { backgroundColor: Colors.metallicBlue }]}>
                                                    <AppText padding={5} textAlign={'left'} fontSize={22} color={Colors.whiteInDarkMode}>{spellCharMagicRenaming(item[0])}</AppText>
                                                    <AppText padding={5} textAlign={'left'} color={Colors.black} fontSize={20}>Cantrips have unlimited uses</AppText>
                                                </View>
                                                :
                                                <TouchableOpacity disabled={item[1] === 0 || item[1] === null} style={[styles.spellSlot,
                                                { backgroundColor: hpColors(this.state.availableMagic[index], item[1]) }]}
                                                    onLongPress={() => {
                                                        Vibration.vibrate(400)
                                                        this.renewSpellSlot(index)
                                                    }} onPress={() => {
                                                        this.useSpellSlot(index)
                                                    }}>
                                                    <AppText padding={5} textAlign={'left'} fontSize={18} color={Colors.whiteInDarkMode}>{spellCharMagicRenaming(item[0])}</AppText>
                                                    <AppText padding={5} textAlign={'left'} color={Colors.black} fontSize={15}>Total slots: {item[1]}</AppText>
                                                    <AppText padding={5} textAlign={'left'} color={Colors.black} fontSize={18}>Available slots: {this.state.availableMagic[index]}</AppText>
                                                </TouchableOpacity>
                                            }
                                        </View>)}
                                </View>
                            </View>
                        }
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
        borderRadius: 70,
        height: 100,
        width: 100
    },
    spellSlot: {
        justifyContent: "center",
        margin: 5,
        backgroundColor: Colors.bitterSweetRed,
        width: 150,
        height: 120,
        borderRadius: 25
    }
});