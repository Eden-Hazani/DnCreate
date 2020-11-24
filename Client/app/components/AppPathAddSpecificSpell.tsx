import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { CharacterModel } from '../models/characterModel';
import { AppText } from './AppText';
import spellsJSON from '../../jsonDump/spells.json'
import { spellLevelChanger } from '../screens/charOptions/helperFunctions/SpellLevelChanger';
import { store } from '../redux/store';


interface AppPathAddSpecificSpellState {
    character: CharacterModel
    alreadyHaveSpell: boolean
}

export class AppPathAddSpecificSpell extends Component<{ character: CharacterModel, path: any, updateSpecificSpell: any, spell: string }, AppPathAddSpecificSpellState>{
    constructor(props: any) {
        super(props)
        this.state = {
            alreadyHaveSpell: false,
            character: store.getState().character
        }
    }
    componentDidMount() {
        const spell = spellsJSON.find((spell: any) => spell.name === this.props.spell)
        console.log(spell)
        const spellLevel = spellLevelChanger(spell.level)
        for (let item of this.state.character.spells[spellLevel]) {
            if (item.spell.name === spell.name) {
                this.setState({ alreadyHaveSpell: true })
                return;
            }
        }
        this.props.updateSpecificSpell(this.props.spell)
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
                        <AppText textAlign={"center"} fontSize={18}>As a level {this.state.character.level} {this.state.character.characterClass} of the {this.props.path} You gain the Following spell</AppText>
                        <AppText textAlign={"center"} fontSize={18}>{this.props.spell}</AppText>
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