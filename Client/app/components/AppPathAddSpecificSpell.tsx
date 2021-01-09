import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { CharacterModel } from '../models/characterModel';
import { AppText } from './AppText';
import spellsJSON from '../../jsonDump/spells.json'
import { spellLevelChanger } from '../screens/charOptions/helperFunctions/SpellLevelChanger';
import { store } from '../redux/store';
import { Colors } from '../config/colors';
import logger from '../../utility/logger';


interface AppPathAddSpecificSpellState {
    character: CharacterModel
    alreadyHaveSpell: boolean
}

export class AppPathAddSpecificSpell extends Component<{
    character: CharacterModel, path: any, updateSpecificSpell: any, spell: string, notCountAgainstKnownCantrips: boolean
}, AppPathAddSpecificSpellState>{
    constructor(props: any) {
        super(props)
        this.state = {
            alreadyHaveSpell: false,
            character: store.getState().character
        }
    }
    componentDidMount() {
        try {
            const spell = spellsJSON.find((spell: any) => spell.name === this.props.spell)
            if (spell && this.state.character.spells) {
                const spellLevel = spellLevelChanger(spell.level)
                for (let item of this.state.character.spells[spellLevel]) {
                    if (item.spell.name === spell.name) {
                        this.setState({ alreadyHaveSpell: true })
                        return;
                    }
                }
                this.props.updateSpecificSpell({ name: this.props.spell, notCountAgainstKnownCantrips: this.props.notCountAgainstKnownCantrips })
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }
    render() {
        return (
            <View style={styles.container}>
                {this.state.alreadyHaveSpell ?
                    <View>
                        <AppText textAlign={"center"} fontSize={18}>Your Character already possess the {this.props.spell} spell.</AppText>
                    </View>
                    :
                    <View>
                        {this.props.notCountAgainstKnownCantrips && <AppText textAlign={"center"} fontSize={18}>This cantrip does not count against your known cantrips</AppText>}
                        <AppText textAlign={"center"} fontSize={18}>As a level {this.state.character.level} {this.state.character.characterClass} of the {this.props.path} You gain the Following spell:</AppText>
                        <AppText textAlign={"center"} fontSize={25} color={Colors.berries}>{this.props.spell}</AppText>
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