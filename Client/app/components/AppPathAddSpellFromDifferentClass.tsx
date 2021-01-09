import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import logger from '../../utility/logger';
import { CharacterModel } from '../models/characterModel';
import { AppText } from './AppText';

interface AppPathAddSpellFromDifferentClassState {
    character: CharacterModel
}


export class AppPathAddSpellFromDifferentClass extends Component<{
    numberOfSpells: number, loadSpellsFromOtherClasses: any,
    character: CharacterModel, className: string, path: string, spellLevel: any
}, AppPathAddSpellFromDifferentClassState>{
    constructor(props: any) {
        super(props)
        this.state = {
            character: this.props.character
        }
    }
    componentDidMount() {
        try {
            const character = { ...this.state.character };
            if (!character.differentClassSpellsToPick) {
                character.differentClassSpellsToPick = [];
            }
            character.differentClassSpellsToPick.push({ className: this.props.className, spellLevel: this.props.spellLevel, numberOfSpells: this.props.numberOfSpells });
            this.setState({ character }, () => {
                this.props.loadSpellsFromOtherClasses(this.state.character)
            })
        } catch (err) {
            logger.log(new Error(err))
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <AppText textAlign={"center"}>As a level {this.state.character.level} {this.state.character.characterClass} of the {this.props.path}</AppText>
                <AppText textAlign={"center"}>You gain {this.props.numberOfSpells} of the {this.props.spellLevel} level from the {this.props.className} class to pick, you will be able to pick them from your spell book after you finish leveling up</AppText>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center"
    }
});