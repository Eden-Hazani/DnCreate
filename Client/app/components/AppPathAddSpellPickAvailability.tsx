import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import logger from '../../utility/logger';
import { Colors } from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { AppText } from './AppText';


export class AppPathAddSpellPickAvailability extends Component<{ spellList: string[], loadSpells: any, character: CharacterModel, path: string }>{
    componentDidMount() {
        try {
            this.props.loadSpells(this.props.spellList)
        } catch (err) {
            logger.log(err)
        }
    }
    componentWillUnmount() {
        this.props.loadSpells([])
    }
    render() {
        return (
            <View style={styles.container}>
                <AppText fontSize={20} textAlign={'center'}>As a level {this.props.character.level} {this.props.character.characterClass} {this.props.path} you gain the ability to pick the following spells.</AppText>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    {this.props.spellList.map(spell =>
                        <View key={spell}>
                            <AppText textAlign={'center'} fontSize={20} color={Colors.berries}>{spell}</AppText>
                        </View>)}
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});