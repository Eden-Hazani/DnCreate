import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import userCharApi from '../../api/userCharApi';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import colors from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import { canReplaceSpells } from './helperFunctions/canReplaceSpells';
import { spellLevelChanger } from './helperFunctions/SpellLevelChanger';
import { spellLevelReadingChanger } from './helperFunctions/spellLevelReadingChanger';

interface CharMagicListsState {
    spellDetailModal: boolean,
    pickedSpellDetail: any,
    character: CharacterModel
}

export class CharMagicLists extends Component<{ character: CharacterModel, spells: any, level: any }, CharMagicListsState> {
    constructor(props: any) {
        super(props)
        this.state = {
            spellDetailModal: false,
            pickedSpellDetail: null,
            character: this.props.character
        }
    }

    removeSpell = () => {
        const character = { ...this.state.character }
        const spellLevel = spellLevelChanger(this.state.pickedSpellDetail.level)
        character.spells[spellLevel] = character.spells[spellLevel].filter((spell: any) => spell.name !== this.state.pickedSpellDetail.name)
        this.setState({ spellDetailModal: false, pickedSpellDetail: null, character }, () => {
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character });
            userCharApi.updateChar(this.state.character)
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ paddingLeft: 10 }}>
                    {this.props?.level[0]?.level && <AppText fontSize={25} color={colors.bitterSweetRed}>{spellLevelReadingChanger(this.props.level[0].level)}</AppText>}
                </View>
                {this.props.spells.map((spell: any) =>
                    <TouchableOpacity key={spell.name} style={styles.spell} onPress={() => { this.setState({ spellDetailModal: true, pickedSpellDetail: spell }) }}>
                        <AppText fontSize={18}>{spell.name}</AppText>
                        <AppText>{spell.description.substring(0, 80)}...</AppText>
                    </TouchableOpacity>
                )}
                <Modal visible={this.state.spellDetailModal}>
                    {this.state.pickedSpellDetail &&
                        <ScrollView>
                            <View style={{ alignItems: "center", padding: 15 }}>
                                <AppText fontSize={25}>{this.state.pickedSpellDetail.name}</AppText>
                                <AppText fontSize={18} textAlign={'center'}>{this.state.pickedSpellDetail.description}</AppText>
                                <View style={{ marginTop: 10 }}>
                                    <AppText fontSize={20}>Range: {this.state.pickedSpellDetail.range}</AppText>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <AppText fontSize={20} textAlign={'center'}>Level &amp; type: {'\n' + this.state.pickedSpellDetail.type}</AppText>
                                </View>
                            </View>
                            <View>
                                <AppButton fontSize={18} backgroundColor={colors.shadowBlue} borderRadius={100}
                                    width={100} height={100} title={"Close"} onPress={() => { this.setState({ pickedSpellDetail: false, spellDetailModal: null }) }} />
                                {this.state.pickedSpellDetail.level === 'cantrip' ?
                                    <View>
                                        <View style={styles.delete}>
                                            <AppText fontSize={20} color={colors.danger} textAlign={'center'}>Cantrips cannot be replaced after picking them!</AppText>
                                            <AppText fontSize={18} textAlign={'center'}>If this is a special request by the DM you still have the option to remove cantrips and replace them</AppText>
                                            <AppButton fontSize={18} backgroundColor={colors.danger} borderRadius={100}
                                                width={100} height={100} title={"Remove Spell"} onPress={() => {
                                                    Alert.alert("Remove cantrip", "Are you sure you want to remove this cantrip?",
                                                        [{
                                                            text: 'Yes', onPress: () => {
                                                                this.removeSpell()
                                                            }
                                                        },
                                                        { text: 'No' }])
                                                }} />
                                        </View>
                                    </View>
                                    :
                                    canReplaceSpells(this.props.character) ?
                                        <View style={styles.delete}>
                                            <AppText fontSize={18} textAlign={'center'}>As a {this.props.character.characterClass} you have the ability to replace your prepared spells every long rest.</AppText>
                                            <AppText fontSize={18} textAlign={'center'}>If you wish to replace this spell, remove it from your prepared spells.</AppText>
                                            <AppButton fontSize={18} backgroundColor={colors.danger} borderRadius={100}
                                                width={100} height={100} title={"Remove Spell"} onPress={() => { this.removeSpell() }} />
                                        </View>
                                        :
                                        <View style={styles.delete}>
                                            <AppText fontSize={18} textAlign={'center'}>As a {this.props.character.characterClass} you can only replace spells the moment you level up.</AppText>
                                            <AppText fontSize={18} textAlign={'center'}>If you just leveled up and wish to replace this spell, hit the remove button and replace it with a different spell.</AppText>
                                            <AppButton fontSize={18} backgroundColor={colors.danger} borderRadius={100}
                                                width={100} height={100} title={"Remove Spell"} onPress={() => {
                                                    Alert.alert("Remove spell", "Leveled up are want to remove spell in order to replace it?",
                                                        [{
                                                            text: 'Yes', onPress: () => {
                                                                this.removeSpell()
                                                            }
                                                        },
                                                        { text: 'No' }])
                                                }} />
                                        </View>
                                }
                            </View>
                        </ScrollView>
                    }
                </Modal>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    spell: {
        padding: 5,
        margin: 5,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: colors.berries
    },
    delete: {
        margin: 5,
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: colors.berries,
        borderRadius: 25
    }
});