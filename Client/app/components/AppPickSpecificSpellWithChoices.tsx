import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { CharacterModel } from '../models/characterModel';
import spellsJSON from '../../jsonDump/spells.json'
import { spellLevelChanger } from '../screens/charOptions/helperFunctions/SpellLevelChanger';
import { AppText } from './AppText';
import colors from '../config/colors';


interface AppPickSpecificSpellWithChoicesState {
    character: CharacterModel
    alreadyHaveSpell: boolean
}

export class AppPickSpecificSpellWithChoices extends Component<{ character: CharacterModel, spell: any, updateSpells: any }, AppPickSpecificSpellWithChoicesState>{
    constructor(props: any) {
        super(props)
        this.state = {
            alreadyHaveSpell: false,
            character: this.props.character
        }
    }
    componentDidMount() {
        const spell = spellsJSON.find((spell: any) => spell.name === this.props.spell.name)
        const spellLevel = spellLevelChanger(spell.level)
        const character = { ...this.state.character };
        for (let item of this.state.character.spells[spellLevel]) {
            if (item.spell.name === spell.name && this.props.spell.canReplaceIfExists) {
                this.setState({ alreadyHaveSpell: true })
                character.magic[spellLevel] = character.magic[spellLevel] + 1;
                this.setState({ character }, () => {
                    this.props.updateSpells(this.state.character)
                })
                return;
            }
        }
        if (!this.props.spell.countAgainstKnown) {
            character.magic[spellLevel] = character.magic[spellLevel] + 1;
        }
        character.spells[spellLevel].push({ spell: spell, removable: false });
        this.setState({ character }, () => {
            this.props.updateSpells(this.state.character)
        })
    }
    render() {
        return (
            <View style={styles.container}>
                {this.state.alreadyHaveSpell ?
                    <View>
                        <AppText textAlign={'center'} fontSize={22}>Since you already possess the spell {this.props.spell.name} you now have an additional spell you can learn from your spell list.</AppText>
                    </View>
                    :
                    <View>
                        <AppText textAlign={'center'} fontSize={20}>You have gain the following spell:</AppText>
                        <AppText color={colors.berries} textAlign={'center'} fontSize={20}>{this.props.spell.name}</AppText>
                        {(!this.props.spell.countAgainstKnown && this.props.spell.cantrip) && <AppText textAlign={'center'} fontSize={18}>This spell does not count against the number of your known cantrips</AppText>}
                    </View>
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});