import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { CharacterModel } from '../models/characterModel';
import { AppText } from './AppText';

interface AppPathAddSpellFromDifferentClassState {
    character: CharacterModel
}


export class AppPathAddSpellFromDifferentClass extends Component<{ numberOfSpells: number, loadSpellsFromOtherClasses: any, character: CharacterModel, className: string, path: string, spellLevel: number }, AppPathAddSpellFromDifferentClassState>{
    constructor(props: any) {
        super(props)
        this.state = {
            character: this.props.character
        }
    }
    componentDidMount() {
        const character = { ...this.state.character };
        character.differentClassSpellsToPick.push({ className: this.props.className, spellLevel: this.props.spellLevel, numberOfSpells: this.props.numberOfSpells });
        this.setState({ character }, () => {
            this.props.loadSpellsFromOtherClasses(this.state.character)
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <AppText>As a level {this.state.character.level} {this.state.character.characterClass} of the {this.props.path}</AppText>
                <AppText>You gain {this.props.numberOfSpells} Spells of the {this.props.className} class to pick, you will be able to pick them from your spell book after you finish leveling up</AppText>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});